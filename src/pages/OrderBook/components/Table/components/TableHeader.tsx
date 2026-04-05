import { IconButton } from "@components/Button";
import { Popover } from "@components/Popover";
import { OrderBookStatusBadge } from "@pages/OrderBook/components/OrderBookStatusBadge";
import type { OrderBookConnectionState } from "@pages/OrderBook/model/orderBook";
import { MoreIcon } from "@/components/Icon";

type TableHeaderProps = {
  connectionState: OrderBookConnectionState;
  errorMessage?: string | null;
};

export function TableHeader({
  connectionState,
  errorMessage,
}: TableHeaderProps) {
  const headerClassName =
    "ob-text-primary relative z-1 flex h-[42px] items-center justify-between ob-section-divider px-4 pt-[4px] font-medium select-none";
  const titleClassName = "ob-text-title-sm ob-text-primary flex items-center";

  return (
    <div className={headerClassName}>
      <div className="flex items-center gap-2">
        <h2 className={titleClassName}>Order Book</h2>
        <OrderBookStatusBadge
          connectionState={connectionState}
          errorMessage={errorMessage}
        />
      </div>
      <Popover.Trigger asChild>
        <IconButton aria-label="Open order book display settings" isActive>
          <MoreIcon />
        </IconButton>
      </Popover.Trigger>
    </div>
  );
}
