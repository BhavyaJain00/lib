/**
 * PERF: this file should be DELETED.
 *
 * It used to wrap every route in a Framer Motion `AnimatePresence` fade, which
 * (a) shipped framer-motion in the shared client chunk of every route, (b) sent
 * `opacity: 0` inline styles in the SSR HTML so the page stayed invisible until
 * JS hydrated, and (c) blocked each navigation on a 400ms exit animation. The
 * branded curtain in components/route-transition-provider.tsx already provides
 * the transition, in CSS, with none of that cost.
 *
 * It is a pass-through for now, but Next.js still remounts the whole page tree
 * on every navigation purely because a template.tsx exists — deleting the file
 * removes that last bit of per-navigation work.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
