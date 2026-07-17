import "server-only";
import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";

const SECRET = process.env.AUTH_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export const SESSION_COOKIE = "navya_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

/** True when admin credentials + a signing secret are all set. */
export const isAdminConfigured = Boolean(SECRET && ADMIN_EMAIL && ADMIN_PASSWORD);

function sign(payload: string): string {
  return createHmac("sha256", SECRET as string).update(payload).digest("hex");
}

/** Constant-time string compare that won't throw on length mismatch. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function checkCredentials(email: string, password: string): boolean {
  if (!isAdminConfigured) return false;
  // Compare both so response time doesn't leak which field was wrong.
  const emailOk = safeEqual(email.trim().toLowerCase(), (ADMIN_EMAIL as string).trim().toLowerCase());
  const passOk = safeEqual(password, ADMIN_PASSWORD as string);
  return emailOk && passOk;
}

function createToken(email: string): string {
  const expires = Date.now() + MAX_AGE_SECONDS * 1000;
  const nonce = randomBytes(8).toString("hex");
  const payload = `${email}|${expires}|${nonce}`;
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

function verifyToken(token: string | undefined): string | null {
  if (!token || !SECRET) return null;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;
  if (!safeEqual(signature, sign(encoded))) return null;

  try {
    const [email, expires] = Buffer.from(encoded, "base64url")
      .toString()
      .split("|");
    if (!email || !expires) return null;
    if (Date.now() > Number(expires)) return null;
    return email;
  } catch {
    return null;
  }
}

export async function createSession(email: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createToken(email), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/** The signed-in admin's email, or null. */
export async function getAdminEmail(): Promise<string | null> {
  const store = await cookies();
  return verifyToken(store.get(SESSION_COOKIE)?.value);
}

export async function isSignedIn(): Promise<boolean> {
  return (await getAdminEmail()) !== null;
}

/**
 * Guards admin server actions. Throws when admin auth is configured and the
 * caller isn't signed in. When credentials aren't configured at all, the panel
 * runs in open dev mode (mirroring the admin layout), so this returns null.
 */
export async function requireAdmin(): Promise<string | null> {
  if (!isAdminConfigured) return null;
  const email = await getAdminEmail();
  if (!email) throw new Error("Unauthorized: admin access required.");
  return email;
}
