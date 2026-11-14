import { useRef } from "react";
import { LP01_CAROUSEL } from "@/lib/lp01Config";

export default function Lp01Carousel() {
  const slides = LP01_CAROUSEL.slides;
  const scrollerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-1 pb-3"
        style={{
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {slides.map((slide) => (
          <figure
            key={slide.src}
            className="snap-center shrink-0 w-[min(78vw,280px)]"
          >
            <div
              className="rounded-[1.5rem] overflow-hidden"
              style={{
                background: "#0a0805",
                border: "1px solid rgba(200,165,107,0.28)",
                boxShadow: "0 18px 48px rgba(0,0,0,0.45)",
              }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="block w-full h-auto"
                loading="lazy"
                decoding="async"
              />
            </div>
            <figcaption
              className="mt-3 text-center text-sm font-medium"
              style={{ color: "rgba(247,242,236,0.7)" }}
            >
              {slide.caption}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-center text-[11px] mt-1" style={{ color: "rgba(200,165,107,0.45)" }}>
        Deslize para ver as telas
      </p>
    </div>
  );
}
