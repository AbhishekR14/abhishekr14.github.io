/**
 * POST /api/chat - the portfolio chatbot endpoint.
 *
 * Request:  { "messages": [ { "role": "user" | "assistant", "content": "..." } ] }
 * Response: text/event-stream of `data: {"text": "..."}` lines, then `data: [DONE]`.
 * Errors:   JSON { "error": "human-readable message" } with an appropriate status.
 */

const {context} = require("../lib/context");
const {buildSystemPrompt} = require("../lib/system-prompt");
const {checkRateLimit} = require("../lib/rate-limit");

const CONTACT_EMAIL = "aranjan0288@gmail.com";
const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const MAX_MESSAGE_CHARS = 1000;
const MAX_BODY_BYTES = 10 * 1024;
const MAX_HISTORY = 10;
const MAX_TOKENS = 1024;

function env(name) {
  const raw = process.env[name];
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  const unquoted =
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
      ? trimmed.slice(1, -1).trim()
      : trimmed;
  return unquoted === "" ? undefined : unquoted;
}

const MODEL = env("CHAT_MODEL") || "gpt-4o-mini";
const SYSTEM_PROMPT = buildSystemPrompt(context);


function fail(res, status, message) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({error: message}));
}

/** Returns an error string, or null if the payload is acceptable. */
function validate(body) {
  if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
    return "Expected a non-empty `messages` array.";
  }
  for (const message of body.messages) {
    if (!message || (message.role !== "user" && message.role !== "assistant")) {
      return "Each message needs a role of `user` or `assistant`.";
    }
    if (typeof message.content !== "string" || message.content.trim() === "") {
      return "Each message needs non-empty string content.";
    }
    if (message.content.length > MAX_MESSAGE_CHARS) {
      return `Messages are limited to ${MAX_MESSAGE_CHARS} characters.`;
    }
  }
  if (body.messages[body.messages.length - 1].role !== "user") {
    return "The last message must come from the user.";
  }
  return null;
}

/** Pulls the text delta out of one upstream SSE payload, or returns "". */
function extractDelta(payload) {
  const choice = payload.choices && payload.choices[0];
  return (choice && choice.delta && choice.delta.content) || "";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return fail(res, 405, "Method not allowed.");
  }

  const raw = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  if (raw && Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
    return fail(res, 413, "That request is too large.");
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (err) {
    return fail(res, 400, "Request body must be valid JSON.");
  }

  const invalid = validate(body);
  if (invalid) {
    return fail(res, 400, invalid);
  }

  const apiKey = env("OPENAI_API_KEY");
  if (!apiKey) {
    return fail(res, 500, "The chat service is not configured.");
  }

  // Rate Limiter
  const rate = await checkRateLimit(req);

  if (!rate.configured) {
    return fail(res, 500, "The chat service is not configured.");
  }

  res.setHeader("RateLimit-Remaining", String(Math.max(0, rate.remaining)));

  if (!rate.allowed) {
    res.setHeader("Retry-After", String(rate.retryAfterSeconds));
    return fail(
      res,
      429,
      `You've hit the message limit for now. Email Abhishek directly at ` +
        `${CONTACT_EMAIL} and he'll get back to you.`
    );
  }

  const messages = body.messages.slice(-MAX_HISTORY).map(m => ({
    role: m.role,
    content: m.content
  }));

  let upstream;
  try {
    upstream = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        max_completion_tokens: MAX_TOKENS,
        stream: true,
        messages: [{role: "system", content: SYSTEM_PROMPT}, ...messages]
      })
    });
  } catch (err) {
    
    console.error("[chat] upstream request failed:", err.message);
    return fail(res, 502, "Could not reach the chat service. Try again shortly.");
  }

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    
    console.error(`[chat] upstream ${upstream.status}:`, detail.slice(0, 500));
    const status = upstream.status === 429 ? 429 : 502;
    return fail(
      res,
      status,
      status === 429
        ? "The chat service is busy right now. Try again in a moment."
        : "The chat service returned an error. Try again shortly."
    );
  }

  res.statusCode = 200;
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");

  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const {done, value} = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, {stream: true});
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "" || data === "[DONE]") continue;

        let payload;
        try {
          payload = JSON.parse(data);
        } catch (err) {
          continue;
        }

        const text = extractDelta(payload);
        if (text) {
          res.write(`data: ${JSON.stringify({text})}\n\n`);
        }
      }
    }
    res.write("data: [DONE]\n\n");
  } catch (err) {
    
    console.error("[chat] stream interrupted:", err.message);
    res.write(`data: ${JSON.stringify({error: "The response was cut short."})}\n\n`);
  } finally {
    res.end();
  }
};
