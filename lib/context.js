/**
 * Knowledge base loader.
 *
 * Reads the markdown files once, at module scope (cold start) - not per request.
 * The whole corpus is a few thousand tokens, so it is injected directly into the
 * system prompt. No retrieval, no chunking, no vector store.
 *
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content");

function read(filename) {
  const filePath = path.join(CONTENT_DIR, filename);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (err) {
    throw new Error(
      `Could not read knowledge base file at ${filePath}. ` +
        `The chat API cannot start without it.`
    );
  }
}

const aboutMe = read("about-me.md");
const resume = read("resume.md");

const context = `${aboutMe}\n\n---\n\n${resume}`.trim();

// Rough sanity check on context size, logged once at cold start.
const approxTokens = Math.round(context.length / 4);

console.log(
  `[chat] knowledge base loaded: ${context.length} chars, ~${approxTokens} tokens`
);

if (approxTokens > 50000) {
  
  console.warn(
    `[chat] context is ~${approxTokens} tokens. Direct injection stops being the ` +
      `right call somewhere above 50k - time to reconsider the architecture.`
  );
}

module.exports = {context, approxTokens};
