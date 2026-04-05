import { BuyModeIcon, DefaultModeIcon, SellModeIcon } from "@components/Icon";
import { ModeButton } from "@pages/OrderBook/components/Table/components/ModeButton";
import type { BookMode } from "@pages/OrderBook/components/Table/hooks";

type TableModeSelectorProps = {
  bookMode: BookMode;
  onSelectDefaultMode: () => void;
  onSelectBuyMode: () => void;
  onSelectSellMode: () => void;
};

export function TableModeSelector({
  bookMode,
  onSelectDefaultMode,
  onSelectBuyMode,
  onSelectSellMode,
}: TableModeSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <ModeButton
        label="Order Book"
        isActive={bookMode === "default"}
        onClick={onSelectDefaultMode}
      >
        <DefaultModeIcon />
      </ModeButton>
      <ModeButton
        label="Buy Order"
        isActive={bookMode === "buy"}
        onClick={onSelectBuyMode}
      >
        <BuyModeIcon />
      </ModeButton>
      <ModeButton
        label="Sell Order"
        isActive={bookMode === "sell"}
        onClick={onSelectSellMode}
      >
        <SellModeIcon />
      </ModeButton>
    </div>
  );
}
