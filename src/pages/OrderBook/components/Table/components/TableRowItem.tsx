import { RowButton } from "@components/Button";
import { TableRowOverlay } from "@pages/OrderBook/components/Table/components/TableRowOverlay";
import { formatTotalValue } from "@pages/OrderBook/components/Table/components/utils";
import type {
  HoveredRow,
  OverlayData,
  RowHighlightState,
} from "@pages/OrderBook/components/Table/hooks";
import type {
  OrderBookRow,
  OrderBookSide,
} from "@pages/OrderBook/model/orderBook";
import { clsx } from "clsx";
import { useCallback } from "react";

type TableRowItemProps = {
  row: OrderBookRow;
  index: number;
  side: OrderBookSide;
  baseAsset: string;
  quoteAsset: string;
  hoveredRow: HoveredRow | null;
  showOverlayStats: boolean;
  roundingEnabled: boolean;
  animationsEnabled: boolean;
  isFlashing: boolean;
  onHoverStart: (index: number) => void;
  onHoverEnd: (index: number) => void;
  getOverlay: (rows: OrderBookRow[], index: number) => OverlayData;
  getRowHighlightState: (
    side: OrderBookSide,
    index: number,
  ) => RowHighlightState;
  rows: OrderBookRow[];
};

export function TableRowItem({
  row,
  index,
  side,
  baseAsset,
  quoteAsset,
  hoveredRow,
  showOverlayStats,
  roundingEnabled,
  animationsEnabled,
  isFlashing,
  onHoverStart,
  onHoverEnd,
  getOverlay,
  getRowHighlightState,
  rows,
}: TableRowItemProps) {
  const valueCellClassName = "ob-table-cell-value";

  const handleHoverStart = useCallback(() => {
    onHoverStart(index);
  }, [index, onHoverStart]);

  const handleHoverEnd = useCallback(() => {
    onHoverEnd(index);
  }, [index, onHoverEnd]);

  const isHoveredRowOnSameSide = hoveredRow?.side === side;
  const isHoveredRowAtIndex = hoveredRow?.index === index;
  const shouldShowOverlay =
    showOverlayStats && isHoveredRowOnSameSide && isHoveredRowAtIndex;
  const highlightState = getRowHighlightState(side, index);
  const overlay = shouldShowOverlay ? getOverlay(rows, index) : undefined;
  const isAsk = row.side === "ask";
  const toneClass = isAsk ? "text-(--sell-color)" : "text-(--buy-color)";
  const barClass = isAsk ? "bg-(--sell-color)" : "bg-(--buy-color)";
  const flashClass = isAsk
    ? "bg-[rgb(from_var(--sell-color)_r_g_b/0.18)]"
    : "bg-[rgb(from_var(--buy-color)_r_g_b/0.18)]";
  const hoverLineClass = isAsk
    ? "top-0 border-t border-dashed"
    : "bottom-0 border-b border-dashed";
  const isHovered = highlightState === "hovered";
  const isRelated = highlightState === "related";
  const isHighlighted = isHovered || isRelated;
  const totalDisplay = formatTotalValue(row.total, roundingEnabled);

  return (
    <div className="ob-table-row">
      <div
        className={clsx(
          "ob-table-row-surface",
          animationsEnabled && "transition-colors duration-500 ease-out",
          isHighlighted && "bg-[rgb(from_var(--color-Input)_r_g_b/0.35)]",
          isFlashing && flashClass,
        )}
      >
        <div
          className={clsx(
            `absolute inset-y-0 left-full z-1 w-full opacity-10 ${barClass}`,
            animationsEnabled && "transition-transform duration-300",
          )}
          style={{ transform: `translateX(-${row.depthPercent}%)` }}
        />
        {isHovered ? (
          <div
            className={clsx(
              "pointer-events-none absolute left-0 right-0 z-3 border-(--line-color-strong)",
              hoverLineClass,
            )}
          />
        ) : null}
        <RowButton
          className={clsx("relative z-2 items-center", "h-full", "!px-0")}
          isActive={isHovered}
          onMouseEnter={handleHoverStart}
          onMouseLeave={handleHoverEnd}
          aria-label={`${row.side} row ${row.price} ${row.amount} ${row.total}`}
        >
          <span className={clsx("ob-table-cell pr-1 text-left", toneClass)}>
            {row.price}
          </span>
          <span className={valueCellClassName}>{row.amount}</span>
          <span className={valueCellClassName}>{totalDisplay}</span>
        </RowButton>
      </div>

      <TableRowOverlay
        overlay={overlay}
        baseAsset={baseAsset}
        quoteAsset={quoteAsset}
      />
    </div>
  );
}
