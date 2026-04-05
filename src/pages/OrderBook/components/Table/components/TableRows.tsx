import { TableRowItem } from "@pages/OrderBook/components/Table/components";
import type {
  HoveredRow,
  OverlayData,
  RowHighlightState,
} from "@pages/OrderBook/components/Table/hooks";
import type {
  OrderBookRow,
  OrderBookSide,
} from "@pages/OrderBook/model/orderBook";

type TableRowsProps = {
  rows: OrderBookRow[];
  side: OrderBookSide;
  reservedRowCount: number;
  baseAsset: string;
  quoteAsset: string;
  hoveredRow: HoveredRow | null;
  showOverlayStats: boolean;
  roundingEnabled: boolean;
  animationsEnabled: boolean;
  isRowFlashing: (key: string) => boolean;
  onHoverStart: (index: number) => void;
  onHoverEnd: (index: number) => void;
  getOverlay: (rows: OrderBookRow[], index: number) => OverlayData;
  getRowHighlightState: (
    side: OrderBookSide,
    index: number,
  ) => RowHighlightState;
};

export function TableRows({
  rows,
  side,
  reservedRowCount,
  baseAsset,
  quoteAsset,
  hoveredRow,
  showOverlayStats,
  roundingEnabled,
  animationsEnabled,
  isRowFlashing,
  onHoverStart,
  onHoverEnd,
  getOverlay,
  getRowHighlightState,
}: TableRowsProps) {
  const placeholderCount = Math.max(0, reservedRowCount - rows.length);
  const sectionHeight = reservedRowCount * 20;

  return (
    <div
      className="flex flex-col overflow-visible"
      style={{
        minHeight: sectionHeight > 0 ? `${sectionHeight}px` : undefined,
        height: sectionHeight > 0 ? `${sectionHeight}px` : undefined,
      }}
    >
      {rows.map((row, index) => {
        const rowKey = row.key ?? `${row.side}-${row.price}`;

        return (
          <TableRowItem
            key={rowKey}
            row={row}
            index={index}
            side={side}
            baseAsset={baseAsset}
            quoteAsset={quoteAsset}
            hoveredRow={hoveredRow}
            showOverlayStats={showOverlayStats}
            roundingEnabled={roundingEnabled}
            animationsEnabled={animationsEnabled}
            isFlashing={isRowFlashing(rowKey)}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
            getOverlay={getOverlay}
            getRowHighlightState={getRowHighlightState}
            rows={rows}
          />
        );
      })}

      {placeholderCount > 0 ? (
        <div
          aria-hidden="true"
          className="px-4"
          style={{ height: `${placeholderCount * 20}px` }}
        />
      ) : null}
    </div>
  );
}
