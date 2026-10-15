"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

// ILYN-style card gallery: swipe on touch devices, arrows + dots on desktop.
// A native scroll-snap row does the work (no carousel library). Each slide is
// its own <Link> so the whole image still opens the product, while the arrow
// buttons sit *beside* the links (buttons can't be nested inside anchors).
export function CardCarousel({
  images,
  alt,
  href,
  priority,
  children,
}: {
  images: string[];
  alt: string;
  href: string;
  priority?: boolean;
  children?: React.ReactNode; // overlay badges
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const multi = images.length > 1;

  function onScroll() {
    const el = rowRef.current;
    if (!el || el.clientWidth === 0) return;
    setIndex(Math.round(el.scrollLeft / el.clientWidth));
  }

  function go(dir: 1 | -1) {
    const el = rowRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  const arrow =
    "absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center bg-background/90 text-foreground opacity-0 transition-opacity hover:bg-background focus-visible:opacity-100 group-hover:opacity-100 md:flex";

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
      <div
        ref={rowRef}
        onScroll={multi ? onScroll : undefined}
        className="flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src, i) => (
          <Link
            key={`${src}-${i}`}
            href={href}
            tabIndex={-1}
            aria-hidden
            draggable={false}
            className="relative block h-full w-full shrink-0 snap-center"
          >
            <Image
              src={src}
              alt={i === 0 ? alt : ""}
              fill
              priority={priority && i === 0}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className={`object-cover ${multi ? "" : "img-zoom"}`}
            />
          </Link>
        ))}
      </div>

      <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">{children}</div>

      {multi && (
        <>
          {index > 0 && (
            <button type="button" aria-label="Previous image" onClick={() => go(-1)} className={`${arrow} left-2`}>
              <HugeiconsIcon icon={ArrowLeft01Icon} size={18} strokeWidth={1.5} />
            </button>
          )}
          {index < images.length - 1 && (
            <button type="button" aria-label="Next image" onClick={() => go(1)} className={`${arrow} right-2`}>
              <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={1.5} />
            </button>
          )}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 bg-background/85 px-2 py-1.5"
          >
            {images.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 transition-colors ${i === index ? "bg-foreground" : "bg-foreground/25"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
