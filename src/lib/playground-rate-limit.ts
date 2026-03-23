// IP-based rate limiting for the playground (no auth required)
// In-memory store - resets on server restart, which is fine for a playground

const ipCalls = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_CALLS = 20; // 20 calls per hour per IP

export function checkPlaygroundRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = ipCalls.get(ip);

  if (!record || now > record.resetAt) {
    ipCalls.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_CALLS - 1 };
  }

  if (record.count >= MAX_CALLS) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: MAX_CALLS - record.count };
}

// Periodic cleanup of expired entries (every 10 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipCalls) {
      if (now > record.resetAt) ipCalls.delete(ip);
    }
  }, 10 * 60 * 1000);
}
