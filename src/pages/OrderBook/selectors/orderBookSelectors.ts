import type {
  GroupedPriceBucket,
  NormalizedDepthLevel,
  OrderBookDerivedView,
  OrderBookDisplayRow,
  OrderBookSelectorInput,
  OrderBookSide as OrderBookSideValue,
  TickSize,
} from "@pages/OrderBook/model/orderBook";
import {
  sortDepthLevelsBySide,
  toBucketPrice,
} from "@pages/OrderBook/utils/depth";
import {
  formatAmount,
  formatConvertedPriceWithPrecision,
  formatPrice,
  formatPriceWithPrecision,
  formatTotal,
} from "@pages/OrderBook/utils/format";

type ComputedBucket = GroupedPriceBucket & {
  totalValue: number;
  depthPercent: number;
  rawPrice: number;
  rawAmount: number;
};

function roundToPrecision(value: number, precision: number) {
  if (!Number.isFinite(value)) {
    return value;
  }

  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

export function bucketDepthLevelsByTickSize(
  levels: NormalizedDepthLevel[],
  tickSize: TickSize,
  side: OrderBookSideValue,
  _roundingEnabled: boolean,
) {
  const buckets = new Map<number, ComputedBucket>();

  for (const level of levels) {
    const bucketPrice = toBucketPrice(level.price, tickSize);
    const existing = buckets.get(bucketPrice);
    const totalValue = level.price * level.quantity;

    if (existing) {
      existing.totalQuantity += level.quantity;
      existing.totalValue += totalValue;
      existing.levelCount += 1;
      continue;
    }

    buckets.set(bucketPrice, {
      bucketPrice,
      totalQuantity: level.quantity,
      cumulativeTotal: 0,
      side,
      levelCount: 1,
      totalValue,
      depthPercent: 0,
      rawPrice: level.price,
      rawAmount: level.quantity,
    });
  }

  return [...buckets.values()].sort((left, right) => {
    return side === "ask"
      ? left.bucketPrice - right.bucketPrice
      : right.bucketPrice - left.bucketPrice;
  });
}

export function calculateCumulativeTotals(buckets: ComputedBucket[]) {
  let runningTotal = 0;

  return buckets.map<ComputedBucket>((bucket) => {
    runningTotal += bucket.totalValue;

    return {
      ...bucket,
      cumulativeTotal: runningTotal,
    };
  });
}

export function calculateDepthPercentages(
  buckets: ComputedBucket[],
  depthMode: OrderBookSelectorInput["depthMode"],
) {
  const depthValues = buckets.map((bucket) =>
    depthMode === "amount" ? bucket.totalQuantity : bucket.cumulativeTotal,
  );
  const maxValue = Math.max(0, ...depthValues);

  if (maxValue === 0) {
    return buckets.map((bucket) => ({
      ...bucket,
      depthPercent: 0,
    }));
  }

  return buckets.map((bucket, index) => ({
    ...bucket,
    depthPercent: ((depthValues[index] ?? 0) / maxValue) * 100,
  }));
}

export function mapBucketsToDisplayRows(
  buckets: ComputedBucket[],
  tickSize: TickSize,
) {
  return buckets.map<OrderBookDisplayRow>((bucket) => ({
    key: `${bucket.side}-${bucket.bucketPrice}`,
    price: formatPrice(bucket.bucketPrice, tickSize),
    amount: formatAmount(bucket.totalQuantity),
    total: formatTotal(bucket.totalValue),
    depthPercent: bucket.depthPercent,
    side: bucket.side,
    rawPrice: bucket.rawPrice,
    rawAmount: bucket.rawAmount,
  }));
}

export function deriveBuySellRatio(
  asks: ComputedBucket[],
  bids: ComputedBucket[],
) {
  const askTotal = asks.reduce((sum, bucket) => sum + bucket.totalQuantity, 0);
  const bidTotal = bids.reduce((sum, bucket) => sum + bucket.totalQuantity, 0);
  const combined = askTotal + bidTotal;

  if (combined === 0) {
    return { buyRatio: 50, sellRatio: 50 };
  }

  const buyRatio = Math.round((bidTotal / combined) * 100);
  return {
    buyRatio,
    sellRatio: 100 - buyRatio,
  };
}

export function buildOrderBookDerivedView({
  bids,
  asks,
  tickSize,
  rowCount,
  depthMode,
  roundingEnabled,
  quoteAsset,
  centerPricePrecision,
}: OrderBookSelectorInput): OrderBookDerivedView {
  const sortedAsks = sortDepthLevelsBySide(asks, "ask");
  const sortedBids = sortDepthLevelsBySide(bids, "bid");
  const rawBestAsk = sortedAsks[0]?.price ?? null;
  const rawBestBid = sortedBids[0]?.price ?? null;
  const askBuckets = bucketDepthLevelsByTickSize(
    sortedAsks,
    tickSize,
    "ask",
    roundingEnabled,
  ).slice(0, rowCount);
  const bidBuckets = bucketDepthLevelsByTickSize(
    sortedBids,
    tickSize,
    "bid",
    roundingEnabled,
  ).slice(0, rowCount);
  const asksWithTotals = calculateDepthPercentages(
    calculateCumulativeTotals(askBuckets),
    depthMode,
  );
  const bidsWithTotals = calculateDepthPercentages(
    calculateCumulativeTotals(bidBuckets),
    depthMode,
  );
  const bestAsk = rawBestAsk;
  const bestBid = rawBestBid;
  const hasBestBidAndAsk = bestAsk !== null && bestBid !== null;
  const spread = hasBestBidAndAsk ? Math.max(0, bestAsk - bestBid) : null;
  const centerValue = hasBestBidAndAsk
    ? (bestAsk + bestBid) / 2
    : (bestAsk ?? bestBid ?? NaN);
  const displayedCenterValue = Number.isFinite(centerValue)
    ? roundToPrecision(centerValue, centerPricePrecision)
    : null;
  const { buyRatio, sellRatio } = deriveBuySellRatio(
    asksWithTotals,
    bidsWithTotals,
  );

  return {
    asks: mapBucketsToDisplayRows([...asksWithTotals].reverse(), tickSize),
    bids: mapBucketsToDisplayRows(bidsWithTotals, tickSize),
    centerPrice: formatPriceWithPrecision(centerValue, centerPricePrecision),
    centerConvertedPrice: formatConvertedPriceWithPrecision(
      centerValue,
      centerPricePrecision,
      quoteAsset,
    ),
    centerValue: displayedCenterValue,
    buyRatio,
    sellRatio,
    effectiveTickSize: tickSize,
    spread,
    bestBid,
    bestAsk,
  };
}
