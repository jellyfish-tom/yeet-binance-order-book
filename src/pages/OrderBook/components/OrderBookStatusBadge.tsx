import { Tooltip } from "@components/Tooltip";
import type { OrderBookConnectionState } from "@pages/OrderBook/model/orderBook";
import { clsx } from "clsx";

type OrderBookStatusBadgeProps = {
  connectionState: OrderBookConnectionState;
  errorMessage?: string | null;
};

const DEFAULT_ERROR_MESSAGE = "Failed to read from Binance websocket.";

const STATUS_COPY: Partial<Record<OrderBookConnectionState, string>> = {
  connecting: "Loading",
  reconnecting: "Reconnecting",
  error: "Connection issue",
};

export function OrderBookStatusBadge({
  connectionState,
  errorMessage,
}: OrderBookStatusBadgeProps) {
  const label = STATUS_COPY[connectionState];

  if (!label) {
    return null;
  }

  const isError = connectionState === "error";
  const resolvedErrorMessage = errorMessage?.trim() || DEFAULT_ERROR_MESSAGE;
  const tooltipLabel = isError ? resolvedErrorMessage : null;

  const badge = (
    <div
      className={clsx(
        "ob-text-secondary inline-flex h-5 items-center gap-1.5 rounded-[4px] px-1.5 text-[10px] leading-none",
        isError && "border border-(--color-LineAlpha) bg-(--panel-bg-deep)",
      )}
    >
      <span
        className={clsx(
          "h-[5px] w-[5px] rounded-full",
          isError ? "bg-(--sell-color)" : "bg-(--coin-accent)",
        )}
      />
      <span>{label}</span>
    </div>
  );

  if (tooltipLabel) {
    return (
      <Tooltip
        label={tooltipLabel}
        isMultiline
        className="justify-start"
        labelClassName="min-w-[180px] max-w-[240px]"
      >
        {badge}
      </Tooltip>
    );
  }

  return badge;
}
