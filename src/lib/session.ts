// Edge-safe session helpers (used by middleware and server code)
import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "hg_admin";
/** Idle timeout: the session ends after this long without activity. */
export const SESSION_TTL = 60 * 60 * 8; // 8 hours
/** Absolute limit: even an active session must sign in again after this. */
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
/** Active sessions are renewed when older than this. */
export const SESSION_RENEW_AFTER = 60 * 15; // 15 minutes

export type Session = { uid: string; email: string; ver: number; auth: number; iat?: number; exp?: number };

const isProd = process.env.NODE_ENV === "production";

function key() {
  const secret = process.env.AUTH_SECRET || "";
  if (secret.length < 32) {
    if (isProd) throw new Error("AUTH_SECRET must be set to a random string of at least 32 characters in production.");
    return new TextEncoder().encode(secret || "dev-only-secret-change-me-dev-only-secret");
  }
  return new TextEncoder().encode(secret);
}

/** Cookie settings for the admin session: not readable by scripts, sent only to this site, HTTPS-only in production. */
export const cookieOptions = (maxAge = SESSION_TTL) => ({
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProd && process.env.INSECURE_COOKIES !== "1",
  path: "/",
  maxAge,
  priority: "high" as const,
});

export async function signSession(p: { uid: string; email: string; ver: number; auth?: number }) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({ uid: p.uid, email: p.email, ver: p.ver, auth: p.auth ?? now })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(key());
}

export async function verifySession(token?: string): Promise<Session | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    const s = payload as unknown as Session;
    if (!s.uid || typeof s.ver !== "number") return null;
    if (Math.floor(Date.now() / 1000) - (s.auth || 0) > SESSION_MAX_AGE) return null;
    return s;
  } catch {
    return null;
  }
}

/** A fresh token for an active session (sliding expiry), or null when no renewal is needed yet. */
export async function renewIfDue(s: Session) {
  const age = Math.floor(Date.now() / 1000) - (s.iat || 0);
  if (age < SESSION_RENEW_AFTER) return null;
  return signSession(s);
}
