import { MenuItemButton } from "@components/Button";
import { clsx } from "clsx";

type DepthModeButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export function DepthModeButton({
  isActive,
  label,
  onClick,
}: DepthModeButtonProps) {
  return (
    <MenuItemButton
      onClick={onClick}
      textTone="primary"
      leftSlot={
        <span
          className={clsx(
            "grid h-4 w-4 place-items-center rounded-full border",
            isActive
              ? "border-(--color-RedGreenBgText) bg-(--surface-selected) text-(--surface-contrast)"
              : "border-(--color-InputLine) bg-transparent text-transparent",
          )}
        >
          <span className="h-[8px] w-[8px] rounded-full bg-(--surface-contrast)" />
        </span>
      }
    >
      <span>{label}</span>
    </MenuItemButton>
  );
}
