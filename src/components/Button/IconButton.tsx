import { Button } from "@components/Button";
import type { ActivatableButtonProps } from "@components/Button/internal/types";
import { clsx } from "clsx";
import { forwardRef } from "react";

type IconButtonProps = ActivatableButtonProps;

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ children, isActive, className, ...buttonProps }, ref) {
    return (
      <Button
        ref={ref}
        size="xxs"
        variant="ghost"
        align="center"
        className={clsx(
          "grid place-items-center",
          "text-(--icon-normal) hover:text-(--text-primary)",
          isActive ? "opacity-100" : "opacity-50",
          className,
        )}
        {...buttonProps}
      >
        {children}
      </Button>
    );
  },
);
