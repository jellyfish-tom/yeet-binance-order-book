import type {
  DepthMode,
  OverlayData,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/types";
import {
  type OrderBookRow,
  TICK_SIZES,
  type TickSize,
} from "@pages/OrderBook/model/orderBook";
import { parseNumericValue } from "@pages/OrderBook/utils/depth";

export function isTickSize(value: string): value is TickSize {
  return TICK_SIZES.some((tickSize) => tickSize === value);
}

export function getTickSize(value: string): TickSize {
  return isTickSize(value) ? value : TICK_SIZES[0];
}

function formatOverlayValue(
  value: number,
  {
    minimumFractionDigits,
    maximumFractionDigits,
    prefix = "",
  }: {
    minimumFractionDigits: number;
    maximumFractionDigits: number;
    prefix?: string;
  },
) {
  return `${prefix}${value.toLocaleString("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  })}`;
}

function getDepthValue(row: OrderBookRow, depthMode: DepthMode) {
  return parseNumericValue(depthMode === "amount" ? row.amount : row.total);
}

export function mapRowsWithDepth(rows: OrderBookRow[], depthMode: DepthMode) {
  const depthValues = rows.map((row) => getDepthValue(row, depthMode));
  const maxValue = Math.max(0, ...depthValues);

  if (maxValue === 0) {
    return rows.map((row) => ({
      ...row,
      depthPercent: 0,
    }));
  }

  return rows.map((row, index) => ({
    ...row,
    depthPercent: ((depthValues[index] ?? 0) / maxValue) * 100,
  }));
}

export function getOverlay(rows: OrderBookRow[], index: number): OverlayData {
  const visibleRows =
    rows[0]?.side === "ask" ? rows.slice(index) : rows.slice(0, index + 1);
  const sumAmount = visibleRows.reduce(
    (sum, current) => sum + parseNumericValue(current.amount),
    0,
  );
  const sumTotal = visibleRows.reduce(
    (sum, current) => sum + parseNumericValue(current.total),
    0,
  );
  const avgPrice = sumAmount === 0 ? 0 : sumTotal / sumAmount;

  return {
    avgPrice: formatOverlayValue(avgPrice, {
      minimumFractionDigits: 5,
      maximumFractionDigits: 5,
      prefix: "≈ ",
    }),
    sumAmount: formatOverlayValue(sumAmount, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    }),
    sumTotal: formatOverlayValue(sumTotal, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 5,
    }),
  };
}

export function getOverlayOffset(index: number, rowCount: number) {
  const middleIndex = Math.floor((rowCount - 1) / 2);
  return (index - middleIndex) * 20;
}
