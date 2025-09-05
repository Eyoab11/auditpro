"use client";

import { useState, useEffect, type ReactNode } from "react";
import { motion, AnimatePresence, type PanInfo } from "framer-motion";
import { wrap } from "popmotion";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

export type CarouselProps = {
  items: ReactNode[];
  autoIntervalMs?: number; // default 10s
  className?: string;
  heightClass?: string; // e.g. "h-64" | "md:h-80"
  ariaLabel?: string;
};

export const Carousel = ({
  items,
  autoIntervalMs = 10000,
  className,
  heightClass = "h-64 md:h-80",
  ariaLabel = "carousel",
}: CarouselProps) => {
  const [[page, direction], setPage] = useState<[number, number]>([0, 0]);
  const itemIndex = wrap(0, items.length, page);

  const paginate = (newDirection: number) => {
    setPage(([p]) => [p + newDirection, newDirection]);
  };

  useEffect(() => {
    const id = setInterval(() => paginate(1), autoIntervalMs);
    return () => clearInterval(id);
  }, [page, autoIntervalMs]);

  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipe = swipePower(info.offset.x, info.velocity.x);
    if (swipe < -swipeConfidenceThreshold) paginate(1);
    else if (swipe > swipeConfidenceThreshold) paginate(-1);
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden select-none",
        "rounded-2xl border border-white/10 bg-[#111]/60 backdrop-blur",
        "shadow-[0_0_30px_rgba(0,0,0,0.35)]",
        heightClass,
        className
      )}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute inset-0 flex items-center justify-center px-6"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={onDragEnd}
        >
          {items[itemIndex]}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button
        type="button"
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        onClick={() => paginate(-1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400"
        onClick={() => paginate(1)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, i) => {
          const active = itemIndex === i;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
      className={cn(
                "w-2.5 h-2.5 rounded-full",
                active ? "bg-purple-500" : "bg-white/30 hover:bg-white/50"
              )}
              onClick={() => setPage([i, i > itemIndex ? 1 : -1])}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
