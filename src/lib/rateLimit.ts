// Spam protection for the public lead endpoints, layer 1: per-IP rate
// limiting. In-memory fixed-window buckets, shared across both lead routes
// per IP. NOTE: this state lives in one server process — if the deployment
// ever runs multiple instances, move the bucket to a shared store (e.g.
// Upstash Redis) or every instance gets its own allowance.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_ENTRIES = 10_000;

const LEAD_LIMIT = 6;
const LEAD_WINDOW_MS = 15 * 60 * 1000;

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export function checkLeadRateLimit(request: Request): { ok: boolean; retryAfterSec: number } {
  return rateLimit(`leads:${getClientIp(request)}`, LEAD_LIMIT, LEAD_WINDOW_MS);
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistic sweep so expired IPs don't grow the map without bound.
  if (buckets.size > MAX_ENTRIES) {
    for (const [k, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfterSec: 0 };
}
