import { MenuItemButton } from "@components/Button";
import { CheckMarkIcon } from "@components/Icon";
import { clsx } from "clsx";

type ToggleMenuButtonProps = {
  isActive: boolean;
  label: string;
  onClick: () => void;
};

export function ToggleMenuButton({
  isActive,
  label,
  onClick,
}: ToggleMenuButtonProps) {
  return (
    <MenuItemButton
      onClick={onClick}
      textTone="primary"
      leftSlot={
        <span
          className={clsx(
            "grid h-4 w-4 place-items-center rounded-[4px]",
            isActive
              ? "bg-(--surface-selected) text-(--surface-contrast)"
              : "border border-(--color-InputLine) text-transparent",
          )}
        >
          <CheckMarkIcon />
        </span>
      }
    >
      <span>{label}</span>
    </MenuItemButton>
  );
}
