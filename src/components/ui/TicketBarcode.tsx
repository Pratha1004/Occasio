"use client";

import { cn } from "@/lib/utils";

interface TicketBarcodeProps {
  className?: string;
  orientation?: "vertical" | "horizontal";
  height?: number;
}

export function TicketBarcode({
  className,
  orientation = "vertical",
  height = 120,
}: TicketBarcodeProps) {
  const bars = [
    3, 1, 2, 4, 1, 3, 1, 2, 1, 4, 2, 1, 3, 1, 1, 4, 2, 3, 1, 2, 1, 3, 4, 1, 2,
    1, 3, 1, 4, 2, 1, 3,
  ];

  if (orientation === "horizontal") {
    return (
      <div
        className={cn("flex items-center gap-[2px] opacity-70", className)}
        aria-hidden="true"
      >
        {bars.map((w, i) => (
          <div
            key={i}
            className="bg-current rounded-xs"
            style={{ width: `${w * 2.5}px`, height: `${height}px` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("flex flex-col items-center justify-between gap-[2px] opacity-70", className)}
      aria-hidden="true"
      style={{ height: `${height}px` }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className="bg-current rounded-xs w-full"
          style={{ height: `${h * 2}px` }}
        />
      ))}
    </div>
  );
}
