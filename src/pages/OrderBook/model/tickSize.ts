export const TICK_SIZES = [
  "0.01",
  "0.1",
  "1",
  "10",
  "50",
  "100",
  "1000",
] as const;

export type TickSize = (typeof TICK_SIZES)[number];
