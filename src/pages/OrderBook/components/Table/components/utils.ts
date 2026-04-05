import { parseNumericValue } from "@pages/OrderBook/utils/depth";

export function formatTotalValue(value: string, roundingEnabled: boolean) {
  const numeric = parseNumericValue(value);

  if (!Number.isFinite(numeric)) {
    return value;
  }

  if (roundingEnabled && Math.abs(numeric) >= 1000) {
    return `${(numeric / 1000).toFixed(2)}K`;
  }

  return numeric.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });
}
