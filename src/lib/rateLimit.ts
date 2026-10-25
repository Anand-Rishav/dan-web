// Spam protection for the public lead endpoints, layer 1: per-IP rate
// limiting. In-memory fixed-window buckets keyed by IP + form.
//
// IMPORTANT (learned in production): on Vercel the forwarded-for header can
// be absent or uniform across visitors — collapsing everyone into one shared
// bucket turned the limiter into a self-inflicted site-wide lockout. If no IP
// header is found we now FAIL OPEN (allow); the honeypot layer still
// discards bots either way.
// NOTE: this state lives in one server process — if the deployment ever runs
// multiple instances, move the bucket to a shared store (e.g. Upstash Redis).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_ENTRIES = 10_000;

const WINDOW_MS = 15 * 60 * 1000;
const LIMIT_PER_FORM = 6;

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",").map((s) => s.trim()).find(Boolean);
    if (first) return first;
  }
  return (
    request.headers.get("x-vercel-ip") ??
    request.headers.get("x-real-ip") ??
    null
  );
}

export function checkLeadRateLimit(
  request: Request,
  form: "brand" | "creator",
): { ok: boolean; retryAfterSec: number } {
  const ip = getClientIp(request);
  // No usable IP header: allow rather than throttle every visitor as one.
  if (!ip) return { ok: true, retryAfterSec: 0 };
  return rateLimit(`leads:${form}:${ip}`, LIMIT_PER_FORM, WINDOW_MS);
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistic sweep so expired keys don't grow the map without bound.
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
