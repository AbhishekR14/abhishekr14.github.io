/**
 * Transport for the chat widget.
 *
 * Defaults to `/api/chat` on the site's own origin, which is where the Vercel
 * function is served from. REACT_APP_CHAT_API_URL overrides it for a split
 * deploy; it is baked in at build time, not read at runtime.
 */

const API_URL = process.env.REACT_APP_CHAT_API_URL || "/api/chat";

export const MAX_MESSAGE_CHARS = 1000;
export const MAX_HISTORY = 10;

/**
 * Streams a reply, calling `onDelta` with each text chunk as it arrives.
 *
 * @param {Array<{role: string, content: string}>} messages conversation so far
 * @param {(text: string) => void} onDelta called with each text chunk
 * @param {AbortSignal} [signal]
 * @returns {Promise<{remaining: number|null}>} resolves when the reply completes
 */
export async function streamChat(messages, onDelta, signal) {
  let response;
  try {
    response = await fetch(API_URL, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({messages: messages.slice(-MAX_HISTORY)}),
      signal
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    const error = new Error(
      "The chat service is unreachable right now - the rest of the site works " +
        "fine. Email Abhishek at aranjan0288@gmail.com and he'll get back to you."
    );
    error.retryable = true;
    throw error;
  }

  if (!response.ok) {
    let message = "Something went wrong. Try again.";
    try {
      const body = await response.json();
      if (body && body.error) message = body.error;
    } catch (err) {
      // Non-JSON error body - keep the generic message.
    }
    const error = new Error(message);
    error.retryable = response.status >= 500;
    throw error;
  }

  // Must match the header name set in api/chat.js.
  const remainingHeader = response.headers.get("RateLimit-Remaining");
  const remaining =
    remainingHeader === null ? null : Number.parseInt(remainingHeader, 10);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

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

      if (payload.error) {
        const error = new Error(payload.error);
        error.retryable = true;
        throw error;
      }
      if (payload.text) onDelta(payload.text);
    }
  }

  return {remaining};
}
