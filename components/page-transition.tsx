/**
 * PERF: unused — kept only so nothing breaks if an old import lingers, and
 * should be DELETED along with app/template.tsx.
 *
 * The original wrapped every page in a Framer Motion `AnimatePresence` fade.
 * That put framer-motion in every route's shared bundle, serialized
 * `opacity: 0` into the SSR HTML (so first paint waited on hydration), and made
 * every navigation sit through a 400ms exit animation whose `exit` variant
 * could never actually run — Next.js destroys the old template instance on
 * navigation. The route curtain in components/route-transition-provider.tsx
 * covers the same ground in pure CSS.
 *
 * This replacement is a plain server-safe pass-through: no client boundary, no
 * animation library, nothing in the SSR HTML that hides content.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
