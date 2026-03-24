"use client";
import React from "react";
import { cn } from "../../lib/cn";

type CarouselProps = {
  children: React.ReactNode; // allow single or multiple children
  auto?: boolean;
  intervalMs?: number;
  showArrows?: boolean;
};

export default function Carousel({ children, auto = true, intervalMs = 4000, showArrows = true }: CarouselProps) {
  const [index, setIndex] = React.useState(0);
  const count = React.Children.count(children);
  const go = (i: number) => setIndex((prev) => (i + count) % count);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const startXRef = React.useRef<number | null>(null);
  const deltaXRef = React.useRef(0);

  React.useEffect(() => {
    if (!auto || isInteracting) return;
    const t = setInterval(() => go(index + 1), intervalMs);
    return () => clearInterval(t);
  }, [index, auto, intervalMs, isInteracting]);

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    setIsInteracting(true);
    startXRef.current = e.touches[0].clientX;
    deltaXRef.current = 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (startXRef.current == null) return;
    const currentX = e.touches[0].clientX;
    deltaXRef.current = currentX - startXRef.current;
  };

  const endTouch = () => {
    const threshold = 40;
    const delta = deltaXRef.current;
    if (Math.abs(delta) > threshold) {
      go(delta < 0 ? index + 1 : index - 1);
    }
    startXRef.current = null;
    deltaXRef.current = 0;
    setIsInteracting(false);
  };

  return (
    <div>
      <div
        className="relative overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={endTouch}
        onTouchCancel={endTouch}
      >
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {React.Children.map(children, (child, i) => (
            <div key={i} className="min-w-full">
              {child}
            </div>
          ))}
        </div>
        {showArrows && count > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => go(index - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 bg-white/90 backdrop-blur text-[color:var(--color-primary-700)] shadow hover:bg-white focus:outline-none"
            >
              {/* Left arrow */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => go(index + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center h-9 w-9 rounded-full border border-black/10 bg-white/90 backdrop-blur text-[color:var(--color-primary-700)] shadow hover:bg-white focus:outline-none"
            >
              {/* Right arrow */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>
        )}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            className={cn(
              "h-2.5 w-2.5 rounded-full border border-[color:var(--color-primary-300)]",
              i === index ? "bg-[color:var(--color-primary-500)]" : "bg-white"
            )}
            onClick={() => go(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}


