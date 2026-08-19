"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import { GraduationCap, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteTarget = "library" | "computech" | "admin" | "admin-library" | "default";

interface RouteTransitionContextType {
  transitionTo: (href: string, target?: SiteTarget) => void;
  /** Warm a destination's RSC payload ahead of the click (hover / focus). */
  prefetch: (href: string) => void;
  isPending: boolean;
}

const RouteTransitionContext = React.createContext<RouteTransitionContextType>({
  transitionTo: () => {},
  prefetch: () => {},
  isPending: false,
});

export function useRouteTransition() {
  return React.useContext(RouteTransitionContext);
}

/** Curtain phases. `enter` is the mounted-but-open base state the CSS animates from. */
type Phase = "enter" | "cover" | "reveal";

/**
 * Curtain timing budget — a FLOOR on every cross-site navigation, since even an
 * instantly-committed route still waits MIN_COVER + REVEAL. Tuned deliberately
 * slow so the branded handoff reads as intentional rather than as a flicker.
 *
 * These must stay in step with the durations in globals.css (`.route-curtain__*`):
 * panels close over 380ms (+60ms stagger) and the badge finishes fading in at
 * ~440ms, so MIN_COVER_MS leaves it ~610ms at full opacity to actually be read.
 *
 * The badge dwell is the part that matters: set MIN_COVER_MS anywhere near the
 * ~440ms landing point and the badge flashes and vanishes, which looks broken
 * rather than fast. Keep a few hundred ms of daylight between them.
 */
const MIN_COVER_MS = 1050;
/** Panels retract over this long (matches .route-curtain__panel in globals.css). */
const REVEAL_MS = 440;
/** Safety net: never trap the user behind the curtain if the route never commits. */
const MAX_COVER_MS = 2500;

export function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // `null` means idle — the overlay isn't mounted at all, so its icon animations
  // and blurred badge cost nothing while the user is just reading the page.
  const [nav, setNav] = React.useState<{ target: SiteTarget; phase: Phase } | null>(
    null
  );

  const navRef = React.useRef(nav);
  navRef.current = nav;

  const startedAtRef = React.useRef(0);
  const timersRef = React.useRef<number[]>([]);

  const clearTimers = React.useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  /** Retract the curtain, holding it up for MIN_COVER_MS total so it isn't a flash. */
  const beginReveal = React.useCallback(() => {
    if (!navRef.current || navRef.current.phase === "reveal") return;
    clearTimers();
    const wait = Math.max(0, MIN_COVER_MS - (Date.now() - startedAtRef.current));
    timersRef.current.push(
      window.setTimeout(() => {
        setNav((n) => (n ? { ...n, phase: "reveal" } : null));
        timersRef.current.push(
          window.setTimeout(() => setNav(null), REVEAL_MS)
        );
      }, wait)
    );
  }, [clearTimers]);

  /**
   * The cross-site buttons navigate with `router.push` rather than `<Link>`, so
   * Next never prefetches them on its own and every switch paid a cold RSC
   * fetch starting at the click. Warming the payload first makes the push
   * resolve from the router cache, which is what actually shortens the wait —
   * the curtain timings above only cap how much of it you see.
   *
   * NOTE: `next dev` disables prefetching entirely, so this is a production-only
   * win. In dev the first visit to a route also pays on-demand compilation.
   */
  const prefetchedRef = React.useRef<Set<string>>(new Set());
  const prefetch = React.useCallback(
    (href: string) => {
      if (prefetchedRef.current.has(href)) return;
      prefetchedRef.current.add(href);
      router.prefetch(href);
    },
    [router]
  );

  // Warm the sibling site once the browser goes idle — by the time the user
  // reaches for the header button the payload is usually already there.
  React.useEffect(() => {
    const sibling =
      pathname.startsWith("/library") || pathname.startsWith("/admin")
        ? "/"
        : "/library";

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => prefetch(sibling));
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => prefetch(sibling), 400);
    return () => window.clearTimeout(id);
  }, [pathname, prefetch]);

  const transitionTo = React.useCallback(
    (href: string, target?: SiteTarget) => {
      if (navRef.current) return;

      // Determine target site if not passed explicitly
      let chosenTarget: SiteTarget = target ?? "default";
      if (!target) {
        if (href.startsWith("/admin/library")) {
          chosenTarget = "admin-library";
        } else if (href.startsWith("/admin")) {
          chosenTarget = "admin";
        } else if (href.startsWith("/library")) {
          chosenTarget = "library";
        } else {
          chosenTarget = "computech";
        }
      }

      startedAtRef.current = Date.now();
      clearTimers();
      setNav({ target: chosenTarget, phase: "enter" });

      // Kick the navigation off NOW rather than mid-animation: Next fetches and
      // renders the destination while the curtain closes, so the animation costs
      // no extra latency instead of adding ~550ms to every click.
      router.push(href);

      // One frame at the base state so the CSS transition to `cover` actually runs.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setNav((n) => (n && n.phase === "enter" ? { ...n, phase: "cover" } : n));
        });
      });

      // If the route never commits (same path, blocked navigation), lift anyway.
      timersRef.current.push(window.setTimeout(beginReveal, MAX_COVER_MS));
    },
    [router, beginReveal, clearTimers]
  );

  // Retract once the new route has committed, and pin the viewport to the top the
  // way the curtain used to. Skips the very first render so `/#section` deep links
  // still land on their anchor.
  const mountedRef = React.useRef(false);
  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (navRef.current) beginReveal();
  }, [pathname, beginReveal]);

  React.useEffect(() => clearTimers, [clearTimers]);

  const value = React.useMemo(
    () => ({ transitionTo, prefetch, isPending: nav !== null }),
    [transitionTo, prefetch, nav]
  );

  const activeTarget = nav?.target ?? "default";

  const getTopBg = () => {
    if (activeTarget === "admin-library") {
      return "bg-gradient-to-b from-slate-950 via-emerald-950 to-teal-950";
    }
    if (activeTarget === "admin") {
      return "bg-gradient-to-b from-slate-950 via-purple-950 to-indigo-950";
    }
    if (activeTarget === "library") {
      return "bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-900";
    }
    return "bg-gradient-to-b from-slate-950 via-blue-950 to-indigo-950";
  };

  const getBottomBg = () => {
    if (activeTarget === "admin-library") {
      return "bg-gradient-to-t from-slate-950 via-emerald-950 to-teal-950";
    }
    if (activeTarget === "admin") {
      return "bg-gradient-to-t from-slate-950 via-purple-950 to-indigo-950";
    }
    if (activeTarget === "library") {
      return "bg-gradient-to-t from-emerald-950 via-emerald-900 to-teal-900";
    }
    return "bg-gradient-to-t from-slate-950 via-blue-950 to-indigo-950";
  };

  const getBadgeIconBg = () => {
    if (activeTarget === "admin-library") {
      return "bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-700 shadow-emerald-500/40";
    }
    if (activeTarget === "admin") {
      return "bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 shadow-purple-500/40";
    }
    if (activeTarget === "library") {
      return "bg-gradient-to-br from-emerald-400 to-teal-600 shadow-emerald-500/40";
    }
    return "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/40";
  };

  const renderBadgeIcon = () => {
    if (activeTarget === "admin-library") {
      return <BookOpen className="h-8 w-8 text-emerald-300 animate-bounce" />;
    }
    if (activeTarget === "admin") {
      return <ShieldCheck className="h-8 w-8 animate-pulse text-amber-300" />;
    }
    if (activeTarget === "library") {
      return <BookOpen className="h-8 w-8 animate-bounce" />;
    }
    return <GraduationCap className="h-8 w-8 animate-pulse" />;
  };

  const getBadgeTagline = () => {
    if (activeTarget === "admin-library") return "Library Admin Control";
    if (activeTarget === "admin") return "Secure Portal";
    if (activeTarget === "library") return "Entering Sub-Site";
    return "Returning to Main Site";
  };

  const getBadgeTitle = () => {
    if (activeTarget === "admin-library") return "Navya Library Management 📚🛡️";
    if (activeTarget === "admin") return "Navya Admin Panel 🛡️";
    if (activeTarget === "library") return "Navya Library 📚";
    return "Navya Computech 🎓";
  };

  const getBadgeDescription = () => {
    if (activeTarget === "admin-library") {
      return "Loading Seat Reservations, Shift Fees & Member Controls...";
    }
    if (activeTarget === "admin") {
      return "Loading ERP Dashboard, Course Controls & Inquiries...";
    }
    if (activeTarget === "library") {
      return "Loading Digital Books, Papers & Lab Materials...";
    }
    return "Loading Master Courses & Placement Support...";
  };

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}

      {/* CSS curtain transition — mounted only while navigating, animated purely
          by the compositor (transform/opacity), no animation library. */}
      {nav && (
        <div
          data-phase={nav.phase}
          aria-hidden="true"
          className="route-curtain"
        >
          {/* Top Panel */}
          <div
            className={cn(
              "route-curtain__panel route-curtain__panel--top",
              getTopBg()
            )}
          />

          {/* Bottom Panel */}
          <div
            className={cn(
              "route-curtain__panel route-curtain__panel--bottom",
              getBottomBg()
            )}
          />

          {/* Center Animated Brand Badge */}
          <div className="route-curtain__badge flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-black/40 px-8 py-6 shadow-2xl">
            <div
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg",
                getBadgeIconBg()
              )}
            >
              {renderBadgeIcon()}
            </div>

            <div className="flex flex-col items-center text-center">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                {getBadgeTagline()}
              </span>
              <h3 className="mt-1 text-xl font-black tracking-tight text-white sm:text-2xl">
                {getBadgeTitle()}
              </h3>
              <p className="mt-1 text-xs font-medium text-white/80">
                {getBadgeDescription()}
              </p>
            </div>
          </div>
        </div>
      )}
    </RouteTransitionContext.Provider>
  );
}
