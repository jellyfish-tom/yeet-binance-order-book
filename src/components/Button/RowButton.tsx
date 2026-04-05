import { Button } from "@components/Button";
import type { ActivatableButtonProps } from "@components/Button/internal/types";
import { clsx } from "clsx";
import { forwardRef } from "react";

type RowButtonProps = ActivatableButtonProps;

export const RowButton = forwardRef<HTMLButtonElement, RowButtonProps>(
  function RowButton({ children, isActive, className, ...buttonProps }, ref) {
    return (
      <Button
        ref={ref}
        size="md"
        className={clsx(
          "flex w-full cursor-pointer items-center text-left",
          isActive && "font-medium",
          className,
        )}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  },
);
