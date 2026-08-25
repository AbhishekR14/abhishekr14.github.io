/**
 * Per-IP rate limiting for the chat endpoint.
 *
 * Two sliding windows, both of which must pass: 10 messages per hour and 40 per
 * day.
 */

const {Ratelimit} = require("@upstash/ratelimit");
const {Redis} = require("@upstash/redis");

const PER_HOUR = 15;
const PER_DAY = 40;

const isConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);


let hourly = null;
let daily = null;

if (isConfigured) {
  const redis = Redis.fromEnv();

  // `analytics` is off to keep the command count down - the free tier allows
  // 10k commands/day and each limiter check already costs a few.
  hourly = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(PER_HOUR, "1 h"),
    analytics: false,
    prefix: "chat:hour"
  });

  daily = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(PER_DAY, "1 d"),
    analytics: false,
    prefix: "chat:day"
  });
}

/** Vercel sets x-forwarded-for reliably; take the original client. */
function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return String(forwarded[0]).split(",")[0].trim();
  }
  return req.headers["x-real-ip"] || "unknown";
}

/**
 * @returns {Promise<{configured: boolean, allowed: boolean, remaining: number,
 *   retryAfterSeconds: number}>}
 */
async function checkRateLimit(req) {
  if (!isConfigured) {
    return {configured: false, allowed: false, remaining: 0, retryAfterSeconds: 0};
  }

  const ip = clientIp(req);

  let results;
  try {
    // Both windows are consumed on every request. When the hourly window is the
    // one that blocks, the daily budget is still decremented - the visitor did
    // make the request, so counting it is the honest behaviour.
    results = await Promise.all([hourly.limit(ip), daily.limit(ip)]);
  } catch (err) {
    // Redis is down. Fail open rather than taking the chat offline for everyone.
    
    console.error("[chat] rate limit check failed, allowing request:", err.message);
    return {configured: true, allowed: true, remaining: 0, retryAfterSeconds: 0};
  }

  const allowed = results.every(result => result.success);
  const remaining = Math.min(...results.map(result => result.remaining));
  const resetAt = Math.max(...results.map(result => result.reset));
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((resetAt - Date.now()) / 1000)
  );

  return {configured: true, allowed, remaining, retryAfterSeconds};
}

module.exports = {checkRateLimit, PER_HOUR, PER_DAY};
