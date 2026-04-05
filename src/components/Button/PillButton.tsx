import { Button } from "@components/Button";
import type { ActivatableButtonProps } from "@components/Button/internal/types";
import { clsx } from "clsx";
import { forwardRef } from "react";

type PillButtonProps = ActivatableButtonProps;

export const PillButton = forwardRef<HTMLButtonElement, PillButtonProps>(
  function PillButton({ children, isActive, className, ...buttonProps }, ref) {
    return (
      <Button
        ref={ref}
        size="lg"
        className={clsx(
          "rounded-full border text-sm font-medium transition",
          isActive
            ? "border-blue-500 bg-blue-500 text-white"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
          className,
        )}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  },
);
