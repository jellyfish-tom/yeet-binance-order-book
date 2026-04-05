import { toggleSwitchSizeClasses } from "@components/ToggleSwitch/classes";
import type { ToggleSwitchSize } from "@components/ToggleSwitch/types";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type ToggleSwitchProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "onClick"
> & {
  isActive: boolean;
  onToggle: () => void;
  size?: ToggleSwitchSize;
};

export function ToggleSwitch({
  isActive,
  onToggle,
  size = "md",
  className,
  ...buttonProps
}: ToggleSwitchProps) {
  const sizeClasses = toggleSwitchSizeClasses[size];

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={isActive}
      className={clsx(
        "relative transition-colors",
        sizeClasses.track,
        isActive ? "bg-(--coin-accent)" : "bg-(--surface-switch)",
        className,
      )}
      {...buttonProps}
    >
      <span
        className={clsx(
          "absolute bg-(--surface-selected) transition-transform duration-150 ease-out",
          sizeClasses.thumb,
          isActive ? sizeClasses.thumbOn : "translate-x-0",
        )}
      />
    </button>
  );
}
