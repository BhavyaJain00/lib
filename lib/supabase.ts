import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Prefer the secret key on the server (full access, bypasses RLS); fall back
// to the publishable key so read-only demo setups still work.
const KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is configured. The site must keep running without it
 * (falling back to the JSON-file store in lib/db.ts), so callers check this —
 * or just handle the `null` from getSupabase() — and degrade gracefully.
 */
export const isSupabaseConfigured = Boolean(URL && KEY);

// Cache across hot reloads in dev and lambda invocations in production.
const globalForSupabase = globalThis as unknown as {
  _supabase?: SupabaseClient;
};

/**
 * Ceiling on a single Supabase request. A healthy query answers in well under a
 * second, so this only ever bites when the project is unreachable — and left
 * unbounded that case stalls the render for however long the OS takes to give
 * up on the connection. Pages feel it directly: the admin panel is
 * force-dynamic, so every navigation into it re-runs these queries.
 */
const REQUEST_TIMEOUT_MS = 5000;

/** Returns the Supabase client, or null when env vars are not set. */
export function getSupabase(): SupabaseClient | null {
  if (!URL || !KEY) return null;
  if (!globalForSupabase._supabase) {
    globalForSupabase._supabase = createClient(URL, KEY, {
      auth: {
        // This is a server-side data client — no user sessions to persist.
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        fetch: (input, init) => {
          const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
          return fetch(input, {
            ...init,
            // Keep whatever signal the caller (or Next) already passed —
            // replacing it outright would break request cancellation.
            signal: init?.signal
              ? AbortSignal.any([init.signal, timeout])
              : timeout,
          });
        },
      },
    });
  }
  return globalForSupabase._supabase;
}
