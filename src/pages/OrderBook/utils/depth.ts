import type { BinanceDepthLevel } from "@pages/OrderBook/model/binance";
import type {
  NormalizedDepthLevel,
  OrderBookSide as OrderBookSideValue,
} from "@pages/OrderBook/model/orderBook";

export function parseNumericValue(value: string) {
  return Number(value.replace(/,/g, ""));
}

export function getTickSizePrecision(tickSize: string) {
  const [, decimalPart = ""] = tickSize.split(".");
  return decimalPart.length;
}

export function normalizeBinanceLevels(
  levels: BinanceDepthLevel[],
  side: OrderBookSideValue,
) {
  return levels.reduce<NormalizedDepthLevel[]>(
    (result, [priceText, quantityText]) => {
      const price = parseNumericValue(priceText);
      const quantity = parseNumericValue(quantityText);
      const hasInvalidLevelValues =
        !Number.isFinite(price) || !Number.isFinite(quantity);

      if (hasInvalidLevelValues) {
        return result;
      }

      result.push({
        priceText,
        quantityText,
        price,
        quantity,
        side,
      });

      return result;
    },
    [],
  );
}

export function sortDepthLevelsBySide(
  levels: NormalizedDepthLevel[],
  side: OrderBookSideValue,
) {
  return [...levels].sort((left, right) => {
    return side === "ask" ? left.price - right.price : right.price - left.price;
  });
}

export function toBucketPrice(price: number, tickSize: string) {
  const tick = parseNumericValue(tickSize);
  const hasInvalidTickSize = !Number.isFinite(tick) || tick <= 0;

  if (hasInvalidTickSize) {
    return price;
  }

  const precision = getTickSizePrecision(tickSize);
  const factor = 10 ** precision;
  const scaledPrice = Math.round(price * factor);
  const scaledTick = Math.round(tick * factor);

  if (scaledTick <= 0) {
    return price;
  }

  const scaledBucket = Math.round(scaledPrice / scaledTick) * scaledTick;

  return scaledBucket / factor;
}
