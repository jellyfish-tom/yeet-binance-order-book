import { getTickSizePrecision } from "@pages/OrderBook/utils/depth";

function isDollarQuotedAsset(quoteAsset: string) {
  return quoteAsset === "USDT" || quoteAsset === "USDC" || quoteAsset === "USD";
}

function formatNumeric(
  value: number,
  minimumFractionDigits: number,
  maximumFractionDigits: number,
) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

export function formatPrice(value: number, tickSize: string) {
  const precision = getTickSizePrecision(tickSize);
  return formatNumeric(value, precision, precision);
}

export function formatPriceWithPrecision(value: number, precision: number) {
  return formatNumeric(value, precision, precision);
}

export function formatAmount(value: number) {
  return formatNumeric(value, 0, 5);
}

export function formatTotal(value: number) {
  return formatNumeric(value, 0, 5);
}

export function formatConvertedPrice(
  value: number,
  tickSize: string,
  quoteAsset: string,
) {
  const formattedPrice = formatPrice(value, tickSize);

  if (formattedPrice === "-") {
    return formattedPrice;
  }

  if (isDollarQuotedAsset(quoteAsset)) {
    return `$${formattedPrice}`;
  }

  return `${formattedPrice} ${quoteAsset}`;
}

export function formatConvertedPriceWithPrecision(
  value: number,
  precision: number,
  quoteAsset: string,
) {
  const formattedPrice = formatPriceWithPrecision(value, precision);

  if (formattedPrice === "-") {
    return formattedPrice;
  }

  if (isDollarQuotedAsset(quoteAsset)) {
    return `$${formattedPrice}`;
  }

  return `${formattedPrice} ${quoteAsset}`;
}
