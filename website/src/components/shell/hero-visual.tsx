"use client";

import Image from "next/image";
import { motion } from "motion/react";

import { withBasePath } from "@/lib/site";

const float = (delay: number, duration: number) => ({
  animate: { y: [0, -5, 0] },
  transition: {
    duration,
    delay,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut" as const,
  },
});

export function HeroVisual() {
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
        <Image
          src={withBasePath("/assets/python-logo.png")}
          alt="Python logo"
          width={2048}
          height={1710}
          priority
          className="size-full object-contain"
        />
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
