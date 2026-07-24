"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";
import { GraduationCap, BookOpen, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteTarget = "library" | "computech" | "admin" | "admin-library" | "default";

interface RouteTransitionContextType {
  transitionTo: (href: string, target?: SiteTarget) => void;
  isPending: boolean;
}

const RouteTransitionContext = React.createContext<RouteTransitionContextType>({
  transitionTo: () => {},
  isPending: false,
});

export function useRouteTransition() {
  return React.useContext(RouteTransitionContext);
}

export function RouteTransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, setIsPending] = React.useState(false);
  const [activeTarget, setActiveTarget] = React.useState<SiteTarget>("default");

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const panelTopRef = React.useRef<HTMLDivElement>(null);
  const panelBottomRef = React.useRef<HTMLDivElement>(null);
  const badgeRef = React.useRef<HTMLDivElement>(null);

  const transitionTo = React.useCallback(
    (href: string, target?: SiteTarget) => {
      if (isPending) return;

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

      setActiveTarget(chosenTarget);
      setIsPending(true);

      const overlay = overlayRef.current;
      const topPanel = panelTopRef.current;
      const bottomPanel = panelBottomRef.current;
      const badge = badgeRef.current;

      if (!overlay || !topPanel || !bottomPanel || !badge) {
        router.push(href);
        setIsPending(false);
        return;
      }

      // GSAP Timeline
      const tl = gsap.timeline({
        onComplete: () => {
          setIsPending(false);
        },
      });

      // Show overlay container
      gsap.set(overlay, { display: "flex", opacity: 1 });
      gsap.set([topPanel, bottomPanel], { scaleY: 0 });
      gsap.set(badge, { opacity: 0, scale: 0.8, y: 15 });

      // Phase 1: Slide panels in to meet in middle
      tl.to([topPanel, bottomPanel], {
        scaleY: 1,
        duration: 0.35,
        ease: "power3.inOut",
        stagger: 0.05,
      })
        // Phase 2: Pop badge in
        .to(
          badge,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.25,
            ease: "back.out(1.7)",
          },
          "-=0.1"
        )
        // Phase 3: Route push mid-way
        .call(() => {
          router.push(href);
        })
        // Hold for smooth feel
        .to({}, { duration: 0.25 })
        // Phase 4: Fade badge out & retract panels
        .to(badge, {
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power2.in",
        })
        .to([topPanel, bottomPanel], {
          scaleY: 0,
          duration: 0.35,
          ease: "power3.inOut",
          stagger: 0.05,
        })
        .set(overlay, { display: "none" });
    },
    [isPending, router]
  );

  // Reset overlay when pathname updates
  React.useEffect(() => {
    if (overlayRef.current) {
      gsap.set(overlayRef.current, { display: "none" });
    }
    setIsPending(false);
  }, [pathname]);

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
    <RouteTransitionContext.Provider value={{ transitionTo, isPending }}>
      {children}

      {/* GSAP Curtain Transition Overlay */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] hidden flex-col items-center justify-center overflow-hidden"
      >
        {/* Top Panel */}
        <div
          ref={panelTopRef}
          className={cn(
            "absolute inset-x-0 top-0 h-1/2 w-full origin-top transition-colors duration-300",
            getTopBg()
          )}
        />

        {/* Bottom Panel */}
        <div
          ref={panelBottomRef}
          className={cn(
            "absolute inset-x-0 bottom-0 h-1/2 w-full origin-bottom transition-colors duration-300",
            getBottomBg()
          )}
        />

        {/* Center Animated Brand Badge */}
        <div
          ref={badgeRef}
          className="relative z-10 flex flex-col items-center gap-3 rounded-2xl border border-white/20 bg-black/40 px-8 py-6 backdrop-blur-xl shadow-2xl"
        >
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
    </RouteTransitionContext.Provider>
  );
}
