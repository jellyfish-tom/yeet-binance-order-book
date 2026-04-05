import { clsx } from "clsx";
import type { ReactNode } from "react";

type TooltipProps = {
  label: ReactNode;
  isMultiline?: boolean;
  isOpen?: boolean;
  side?: "top" | "right";
  className?: string;
  labelClassName?: string;
  arrowClassName?: string;
  children: ReactNode;
};

export function Tooltip({
  label,
  isMultiline = false,
  isOpen = false,
  side = "top",
  className,
  labelClassName,
  arrowClassName,
  children,
}: TooltipProps) {
  const isRightSide = side === "right";

  return (
    <div
      className={clsx(
        "group relative flex items-center justify-center",
        className,
      )}
    >
      {children}
      <span
        className={clsx(
          "pointer-events-none absolute z-10 transition-all duration-150 ease-out",
          isRightSide
            ? "left-full top-1/2 ml-1 -translate-y-1/2"
            : "bottom-full left-1/2 mb-1 -translate-x-1/2",
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95",
          !isOpen && "group-hover:opacity-100 group-hover:scale-100",
          isMultiline && "w-full max-w-[90%]",
        )}
      >
        <span
          className={clsx(
            "ob-text-body-xs ob-text-primary block rounded-[8px] bg-(--tooltip-bg) px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.3)]",
            isMultiline
              ? "h-auto whitespace-normal wrap-break-word"
              : "whitespace-nowrap",
            labelClassName,
          )}
        >
          {label}
        </span>
        <span
          className={clsx(
            "absolute h-0 w-0",
            isRightSide
              ? "right-full top-1/2 -translate-y-1/2 border-b-[5px] border-b-transparent border-r-[5px] border-r-(--tooltip-bg) border-t-[5px] border-t-transparent"
              : "left-1/2 top-[99%] -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-(--tooltip-bg)",
            arrowClassName,
          )}
        />
      </span>
    </div>
  );
}
