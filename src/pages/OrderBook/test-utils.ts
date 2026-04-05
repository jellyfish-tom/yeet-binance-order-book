import type {
  NormalizedDepthLevel,
  OrderBookSide,
} from "@pages/OrderBook/model/orderBook";

export function makeLevel(
  price: number,
  quantity: number,
  side: OrderBookSide,
): NormalizedDepthLevel {
  return {
    price,
    quantity,
    priceText: String(price),
    quantityText: String(quantity),
    side,
  };
}
