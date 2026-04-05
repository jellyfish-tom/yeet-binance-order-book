import { MenuItemButton } from "@components/Button";
import type { TickSize } from "@pages/OrderBook/model/orderBook";
import { CheckMarkIcon } from "@/components/Icon";

type TickSizeOptionProps = {
  option: TickSize;
  isActive: boolean;
  onSelectTickSize: (tickSize: TickSize) => void;
};

export function TickSizeOption({
  option,
  isActive,
  onSelectTickSize,
}: TickSizeOptionProps) {
  return (
    <MenuItemButton
      onClick={() => onSelectTickSize(option)}
      isSelected={isActive}
      rightSlot={
        <span
          className={isActive ? "text-(--text-primary)" : "text-transparent"}
        >
          <CheckMarkIcon />
        </span>
      }
    >
      <span>{option}</span>
    </MenuItemButton>
  );
}
