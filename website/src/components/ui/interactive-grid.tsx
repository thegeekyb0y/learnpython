"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InteractiveGridProps extends React.ComponentProps<"svg"> {
  /** Side of a cell, in pixels (aligned to 4px grid). */
  cellSize?: number;
}

export function InteractiveGrid({
  cellSize = 48,
  className,
  ...props
}: InteractiveGridProps) {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [size, setSize] = React.useState({ columns: 0, rows: 0 });
  const [active, setActive] = React.useState<number | null>(null);

  React.useEffect(() => {
    const svg = svgRef.current;
    const parent = svg?.parentElement;
    if (!svg || !parent) return;

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = svg.getBoundingClientRect();
      setSize({
        columns: Math.ceil(width / cellSize),
        rows: Math.ceil(height / cellSize),
      });
    });
    resizeObserver.observe(svg);

    function onPointerMove(event: PointerEvent) {
      const bounds = svg!.getBoundingClientRect();
      const column = Math.floor((event.clientX - bounds.left) / cellSize);
      const row = Math.floor((event.clientY - bounds.top) / cellSize);
      const columns = Math.ceil(bounds.width / cellSize);
      setActive(
        column >= 0 && row >= 0 && column < columns
          ? row * columns + column
          : null,
      );
    }

    function onPointerLeave() {
      setActive(null);
    }

    parent.addEventListener("pointermove", onPointerMove);
    parent.addEventListener("pointerleave", onPointerLeave);
    return () => {
      resizeObserver.disconnect();
      parent.removeEventListener("pointermove", onPointerMove);
      parent.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [cellSize]);

  return (
    <svg
      ref={svgRef}
      data-slot="interactive-grid"
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full text-[#3C477D]",
        className,
      )}
      {...props}
    >
      {Array.from({ length: size.columns * size.rows }, (_, index) => (
        <rect
          key={index}
          x={(index % size.columns) * cellSize}
          y={Math.floor(index / size.columns) * cellSize}
          width={cellSize}
          height={cellSize}
          fill="currentColor"
          stroke="currentColor"
          strokeOpacity={0.07}
          className={cn(
            "transition-[fill-opacity] ease-out motion-reduce:transition-none",
            index === active
              ? "duration-0 [fill-opacity:0.12]"
              : "duration-1000 [fill-opacity:0]",
          )}
        />
      ))}
    </svg>
  );
}

export default InteractiveGrid;
