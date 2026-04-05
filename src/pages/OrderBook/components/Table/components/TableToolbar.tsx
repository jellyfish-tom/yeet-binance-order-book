import { Button } from "@components/Button";
import { CaretDownIcon } from "@components/Icon";
import { Popover } from "@components/Popover";
import {
  TableModeSelector,
  TickSizeOption,
} from "@pages/OrderBook/components/Table/components";
import type { BookMode } from "@pages/OrderBook/components/Table/hooks";
import {
  TICK_SIZES,
  type TickSize as TickSizeValue,
} from "@pages/OrderBook/model/orderBook";

type TableToolbarProps = {
  bookMode: BookMode;
  isTickSizeOpen: boolean;
  selectedTickSize: TickSizeValue;
  onSelectDefaultMode: () => void;
  onSelectBuyMode: () => void;
  onSelectSellMode: () => void;
  onTickSizeOpenChange: (open: boolean) => void;
  onSelectTickSize: (tickSize: TickSizeValue) => void;
};

export function TableToolbar({
  bookMode,
  isTickSizeOpen,
  selectedTickSize,
  onSelectDefaultMode,
  onSelectBuyMode,
  onSelectSellMode,
  onTickSizeOpenChange,
  onSelectTickSize,
}: TableToolbarProps) {
  return (
    <div className="mx-4 mb-1 mt-3 flex items-center justify-between">
      <TableModeSelector
        bookMode={bookMode}
        onSelectDefaultMode={onSelectDefaultMode}
        onSelectBuyMode={onSelectBuyMode}
        onSelectSellMode={onSelectSellMode}
      />

      <Popover.Root open={isTickSizeOpen} onOpenChange={onTickSizeOpenChange}>
        <Popover.Trigger asChild>
          <Button
            size="xs"
            variant="ghost"
            align="right"
            aria-label="Select tick size"
            className="ob-text-primary flex cursor-pointer items-center justify-end pl-2 pr-[2px]"
          >
            <span className="ob-text-body-xs block">{selectedTickSize}</span>
            <span className="ob-icon-normal">
              <CaretDownIcon />
            </span>
          </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="bottom"
            align="end"
            sideOffset={4}
            className="ob-floating-panel ob-text-secondary w-[126px] py-[10px]"
          >
            {TICK_SIZES.map((option: TickSizeValue) => {
              const isActive = option === selectedTickSize;

              return (
                <TickSizeOption
                  key={option}
                  option={option}
                  isActive={isActive}
                  onSelectTickSize={onSelectTickSize}
                />
              );
            })}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
