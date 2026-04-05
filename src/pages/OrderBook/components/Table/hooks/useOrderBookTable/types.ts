import type {
  CenterPriceDirection,
  DepthMode,
  OrderBookSide,
  TickSize,
} from "@pages/OrderBook/model/orderBook";
import type { Dispatch } from "react";

export type { DepthMode };
export type BookMode = "default" | "buy" | "sell";
export type RowHighlightState = "idle" | "hovered" | "related";
export type FlashingRowKeys = Record<string, true>;

export const TABLE_STATE_ACTION_TYPE = {
  setMenuOpen: "set-menu-open",
  setTickSizeOpen: "set-tick-size-open",
  toggleOverlayStats: "toggle-overlay-stats",
  toggleRatioBar: "toggle-ratio-bar",
  toggleRounding: "toggle-rounding",
  setDepthMode: "set-depth-mode",
  toggleAnimations: "toggle-animations",
  setBookMode: "set-book-mode",
  syncSelectedTickSize: "sync-selected-tick-size",
  selectTickSize: "select-tick-size",
  hoverRowStart: "hover-row-start",
  hoverRowEnd: "hover-row-end",
  setCenterPriceDirection: "set-center-price-direction",
  markFlashingRows: "mark-flashing-rows",
  clearFlashingRow: "clear-flashing-row",
  resetFlashingRows: "reset-flashing-rows",
} as const;

export type OverlayData = {
  avgPrice: string;
  sumAmount: string;
  sumTotal: string;
};
export type HoveredRow = {
  side: OrderBookSide;
  index: number;
};

export type TableState = {
  isMenuOpen: boolean;
  isTickSizeOpen: boolean;
  hoveredRow: HoveredRow | null;
  showOverlayStats: boolean;
  showRatioBar: boolean;
  roundingEnabled: boolean;
  depthMode: DepthMode;
  bookMode: BookMode;
  animationsEnabled: boolean;
  flashingRowKeys: FlashingRowKeys;
  rowFlashResetVersion: number;
  centerPriceDirection: CenterPriceDirection;
  selectedTickSize: TickSize;
};

export type TableStateAction =
  | { type: typeof TABLE_STATE_ACTION_TYPE.setMenuOpen; open: boolean }
  | { type: typeof TABLE_STATE_ACTION_TYPE.setTickSizeOpen; open: boolean }
  | { type: typeof TABLE_STATE_ACTION_TYPE.toggleOverlayStats }
  | { type: typeof TABLE_STATE_ACTION_TYPE.toggleRatioBar }
  | { type: typeof TABLE_STATE_ACTION_TYPE.toggleRounding }
  | { type: typeof TABLE_STATE_ACTION_TYPE.setDepthMode; depthMode: DepthMode }
  | { type: typeof TABLE_STATE_ACTION_TYPE.toggleAnimations }
  | { type: typeof TABLE_STATE_ACTION_TYPE.setBookMode; bookMode: BookMode }
  | {
      type: typeof TABLE_STATE_ACTION_TYPE.syncSelectedTickSize;
      tickSize: TickSize;
    }
  | { type: typeof TABLE_STATE_ACTION_TYPE.selectTickSize; tickSize: TickSize }
  | {
      type: typeof TABLE_STATE_ACTION_TYPE.hoverRowStart;
      side: OrderBookSide;
      index: number;
    }
  | {
      type: typeof TABLE_STATE_ACTION_TYPE.hoverRowEnd;
      side: OrderBookSide;
      index: number;
    }
  | {
      type: typeof TABLE_STATE_ACTION_TYPE.setCenterPriceDirection;
      direction: CenterPriceDirection;
    }
  | { type: typeof TABLE_STATE_ACTION_TYPE.markFlashingRows; keys: string[] }
  | { type: typeof TABLE_STATE_ACTION_TYPE.clearFlashingRow; key: string }
  | { type: typeof TABLE_STATE_ACTION_TYPE.resetFlashingRows };

export type TableStateDispatch = Dispatch<TableStateAction>;
