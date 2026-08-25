/**
 * Local host for the chat endpoint.
 *
 * Create React App's dev server only serves the React app - it never executes
 * `api/chat.js`, which on Vercel becomes a serverless function. This runs that
 * same handler on a plain Node server so the widget works end to end locally.
 *
 * Usage: `npm run dev:api` in one terminal, `npm start` in another.
 * CRA's `proxy` field forwards /api/chat here, so the widget needs no config.
 *
 * Production is unaffected - Vercel invokes api/chat.js directly.
 */

require("dotenv").config();

const http = require("http");

const PORT = process.env.DEV_API_PORT || 3001;

// Required after dotenv so the handler sees the loaded environment at import.
const chatHandler = require("../api/chat");

const server = http.createServer((req, res) => {
  if (!req.url.startsWith("/api/chat")) {
    res.statusCode = 404;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({error: "Not found. Only /api/chat is served here."}));
    return;
  }

  const chunks = [];
  req.on("data", chunk => chunks.push(chunk));
  req.on("end", () => {
    // Vercel populates req.body; the handler accepts a raw string and parses it.
    req.body = Buffer.concat(chunks).toString("utf8");

    Promise.resolve(chatHandler(req, res)).catch(err => {
      
      console.error("[dev-api] handler threw:", err);
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({error: "Handler crashed. See the dev-api logs."}));
      } else {
        res.end();
      }
    });
  });
});

server.listen(PORT, () => {
  
  console.log(`[dev-api] chat endpoint listening on http://localhost:${PORT}/api/chat`);
});
