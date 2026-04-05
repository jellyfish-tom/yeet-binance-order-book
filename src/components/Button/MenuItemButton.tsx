import { Button } from "@components/Button";
import type { ButtonWrapperProps } from "@components/Button/internal/types";
import { clsx } from "clsx";
import type { ReactNode } from "react";
import { forwardRef } from "react";

type MenuItemButtonProps = ButtonWrapperProps & {
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  isSelected?: boolean;
  textTone?: "primary" | "secondary";
};

export const MenuItemButton = forwardRef<
  HTMLButtonElement,
  MenuItemButtonProps
>(function MenuItemButton(
  {
    children,
    leftSlot,
    rightSlot,
    isSelected = false,
    textTone = "secondary",
    className,
    ...buttonProps
  },
  ref,
) {
  return (
    <Button
      ref={ref}
      size="sm"
      variant={isSelected ? "subtleAccent" : "subtle"}
      className={clsx(
        "ob-text-action-sm flex w-full items-center justify-start",
        textTone === "primary"
          ? "text-(--text-primary)"
          : "text-(--text-secondary)",
        isSelected && "text-(--text-primary)",
        className,
      )}
      {...buttonProps}
    >
      <span className="flex items-center gap-3">
        {leftSlot}
        {children}
      </span>
      {rightSlot ? <span className="ml-auto">{rightSlot}</span> : null}
    </Button>
  );
});
