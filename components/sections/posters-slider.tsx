"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  ExternalLink,
  Maximize2,
  X,
  Volume2,
  VolumeX,
} from "lucide-react";
import type { PosterDoc } from "@/lib/db";
import { cn } from "@/lib/utils";

interface PostersSliderProps {
  posters: PosterDoc[];
}

export function PostersSlider({ posters }: PostersSliderProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const [lightboxPoster, setLightboxPoster] = React.useState<PosterDoc | null>(null);

  const activePosters = React.useMemo(() => {
    return posters.filter((p) => p.isActive);
  }, [posters]);

  const count = activePosters.length;

  // Auto-play timer (5 seconds)
  React.useEffect(() => {
    if (count <= 1 || isPaused || lightboxPoster) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % count);
    }, 5000);

    return () => clearInterval(timer);
  }, [count, isPaused, lightboxPoster]);

  if (count === 0) return null;

  const currentPoster = activePosters[currentIndex] || activePosters[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + count) % count);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % count);
  };

  return (
    <section className="relative overflow-hidden py-12 md:py-16 bg-slate-950 text-white">
      {/* Background Glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-purple-600/20 blur-[120px]"
        aria-hidden="true"
      />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              <span>Announcements & Featured Posters</span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
              Latest Highlights & Offers
            </h2>
            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Swipe through campus posters, upcoming batches, and official certifications.
            </p>
          </div>

          {/* Autoplay & Count Controls */}
          {count > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-slate-400">
                <span className="text-blue-400 font-bold">
                  {String(currentIndex + 1).padStart(2, "0")}
                </span>{" "}
                / {String(count).padStart(2, "0")}
              </span>
              <button
                type="button"
                onClick={() => setIsPaused((v) => !v)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900/80 text-slate-300 transition-colors hover:border-slate-700 hover:text-white"
                title={isPaused ? "Resume auto-play" : "Pause auto-play"}
              >
                {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </button>
            </div>
          )}
        </div>

        {/* Carousel Box */}
        <div
          className="relative min-h-[420px] sm:min-h-[460px] md:min-h-[500px] w-full overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPoster._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid min-h-[420px] sm:min-h-[460px] md:min-h-[500px] grid-cols-1 lg:grid-cols-12"
            >
              {/* Image Column */}
              <div className="relative group min-h-[260px] sm:min-h-[320px] lg:min-h-full lg:col-span-7 overflow-hidden bg-slate-950">
                {currentPoster.imageUrl ? (
                  <Image
                    src={currentPoster.imageUrl}
                    alt={currentPoster.title}
                    fill
                    priority
                    unoptimized
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-600">
                    No Poster Image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-slate-950/40 lg:to-slate-950" />

                {/* Lightbox Trigger Button */}
                <button
                  type="button"
                  onClick={() => setLightboxPoster(currentPoster)}
                  className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-white backdrop-blur-md transition-all hover:bg-white hover:text-slate-950 hover:scale-110 shadow-lg"
                  title="View full poster"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {/* Text / Info Column */}
              <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:col-span-5 relative z-10">
                <div className="space-y-4">
                  {currentPoster.badge && (
                    <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1 text-xs font-bold text-white shadow-md">
                      {currentPoster.badge}
                    </span>
                  )}
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
                    {currentPoster.title}
                  </h3>
                  {currentPoster.subtitle && (
                    <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                      {currentPoster.subtitle}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {currentPoster.linkUrl ? (
                    currentPoster.linkUrl.startsWith("#") ? (
                      <a
                        href={currentPoster.linkUrl}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
                      >
                        <span>Take Action Now</span>
                        <ChevronRight className="h-4 w-4" />
                      </a>
                    ) : (
                      <Link
                        href={currentPoster.linkUrl}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
                      >
                        <span>Learn More</span>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )
                  ) : (
                    <a
                      href="#inquiry"
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all hover:bg-blue-500 hover:shadow-blue-500/40 active:scale-95"
                    >
                      <span>Enquire Now</span>
                      <ChevronRight className="h-4 w-4" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => setLightboxPoster(currentPoster)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-3 text-sm font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-700"
                  >
                    <Maximize2 className="h-4 w-4 text-slate-400" />
                    <span>Zoom Poster</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white backdrop-blur-md transition-all hover:bg-blue-600 hover:border-blue-500 hover:scale-110 active:scale-95 shadow-xl"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-slate-950/70 text-white backdrop-blur-md transition-all hover:bg-blue-600 hover:border-blue-500 hover:scale-110 active:scale-95 shadow-xl"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Pagination Indicators */}
          {count > 1 && (
            <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-3 py-1.5 backdrop-blur-md">
              {activePosters.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300",
                    idx === currentIndex
                      ? "w-8 bg-blue-500 shadow-md shadow-blue-500/50"
                      : "w-2.5 bg-slate-600 hover:bg-slate-400"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Zoom Modal */}
      <AnimatePresence>
        {lightboxPoster && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setLightboxPoster(null)}
                className="absolute top-4 right-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white transition-colors hover:bg-rose-600"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative h-[65vh] w-[85vw] max-w-4xl bg-slate-950">
                <Image
                  src={lightboxPoster.imageUrl}
                  alt={lightboxPoster.title}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="100vw"
                />
              </div>

              <div className="p-4 sm:p-6 bg-slate-900 text-white border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    {lightboxPoster.badge && (
                      <span className="inline-block rounded-full bg-blue-600/30 px-3 py-0.5 text-xs font-semibold text-blue-400 mb-1">
                        {lightboxPoster.badge}
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-white">{lightboxPoster.title}</h4>
                    {lightboxPoster.subtitle && (
                      <p className="text-sm text-slate-400 mt-0.5">{lightboxPoster.subtitle}</p>
                    )}
                  </div>
                  {lightboxPoster.linkUrl && (
                    <a
                      href={lightboxPoster.linkUrl}
                      onClick={() => setLightboxPoster(null)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
                    >
                      <span>Explore</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
