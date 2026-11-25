"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { assetPath } from "@/lib/site";

const float = (delay: number, duration: number) => ({
  animate: { y: [0, -5, 0] },
  transition: {
    duration,
    delay,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
  },
});

const logoSrc = assetPath("/assets/python-logo.png");

export function HeroVisual() {
  const [logoFailed, setLogoFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;

    // A request that fails before hydration will not replay its error event,
    // so check the already-loaded element once React takes over.
    if (image?.complete && image.naturalWidth === 0) {
      setLogoFailed(true);
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      data-slot="hero-visual"
      className="relative flex h-[360px] w-full max-w-[440px] items-center justify-center"
    >
      <div
        data-slot="python-logo"
        className="relative flex size-[300px] items-center justify-center"
      >
        {logoFailed ? (
          <span
            data-slot="python-logo-fallback"
            className="flex size-64 items-center justify-center rounded-full border border-ink/10 bg-ink font-mono text-5xl font-semibold tracking-tight text-sage shadow-pop"
          >
            py
          </span>
        ) : (
          <Image
            src={logoSrc}
            alt=""
            width={704}
            height={588}
            priority
            decoding="async"
            onError={() => setLogoFailed(true)}
            ref={imageRef}
            data-slot="python-logo-image"
            className="size-full object-contain"
          />
        )}
      </div>

      <motion.span
        {...float(0, 6)}
        className="absolute top-12 left-0 rounded-lg border border-hairline bg-surface px-3 py-2 font-mono text-[11px] text-brand"
      >
        &gt;&gt;&gt;
      </motion.span>
      <motion.span
        {...float(0.8, 7)}
        className="absolute top-24 right-0 rounded-lg border border-hairline bg-surface px-3 py-2 font-mono text-[11px] text-ink-3"
      >
        def main():
      </motion.span>
      <motion.span
        {...float(1.6, 5.5)}
        className="absolute bottom-14 left-8 rounded-lg border border-sage-line bg-sage-soft px-3 py-2 font-mono text-[11px] text-ink-3"
      >
        .py
      </motion.span>
    </div>
  );
}
