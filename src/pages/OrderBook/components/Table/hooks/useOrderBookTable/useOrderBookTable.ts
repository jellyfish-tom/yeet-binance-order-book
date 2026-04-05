import {
  getHighlightState,
  syncCenterPriceDirection,
  syncRowFlashTracking,
  syncSelectedTickSize,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/effects";
import {
  createInitialTableState,
  createTableActionHandlers,
  tableStateReducer,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/state";
import type {
  OverlayData,
  RowHighlightState,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/types";
import { getOverlay } from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/utils";
import type {
  NormalizedDepthLevel,
  OrderBookRow,
  OrderBookSide,
  TickSize,
} from "@pages/OrderBook/model/orderBook";
import { buildOrderBookDerivedView } from "@pages/OrderBook/selectors/orderBookSelectors";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

const EMPTY_ROWS: OrderBookRow[] = [];

export type UseOrderBookTableArgs = {
  asks: NormalizedDepthLevel[];
  bids: NormalizedDepthLevel[];
  priceStep: TickSize;
  rowCount: number;
  quoteAsset: string;
  centerPricePrecision: number;
};

export function useOrderBookTable({
  asks,
  bids,
  priceStep,
  rowCount,
  quoteAsset,
  centerPricePrecision,
}: UseOrderBookTableArgs) {
  const [tableState, dispatch] = useReducer(
    tableStateReducer,
    priceStep,
    createInitialTableState,
  );
  const selectedTickSize = tableState.selectedTickSize;
  const roundingEnabled = tableState.roundingEnabled;
  const bookMode = tableState.bookMode;
  const animationsEnabled = tableState.animationsEnabled;
  const rowFlashResetVersion = tableState.rowFlashResetVersion;
  const previousRowSignaturesRef = useRef<Map<string, string>>(new Map());
  const flashTimersRef = useRef<Map<string, number>>(new Map());
  const previousCenterValueRef = useRef<number | null>(null);
  const previousRowFlashResetVersionRef = useRef(rowFlashResetVersion);

  const clearFlashTimers = useCallback(() => {
    for (const timer of flashTimersRef.current.values()) {
      window.clearTimeout(timer);
    }

    flashTimersRef.current.clear();
  }, []);

  useEffect(() => {
    syncSelectedTickSize(priceStep, dispatch);
  }, [priceStep]);

  const derivedView = useMemo(
    () =>
      buildOrderBookDerivedView({
        asks,
        bids,
        tickSize: selectedTickSize,
        rowCount,
        depthMode: tableState.depthMode,
        roundingEnabled,
        quoteAsset,
        centerPricePrecision,
      }),
    [
      asks,
      bids,
      centerPricePrecision,
      quoteAsset,
      rowCount,
      tableState.depthMode,
      roundingEnabled,
      selectedTickSize,
    ],
  );

  useEffect(() => {
    syncCenterPriceDirection(
      derivedView.centerValue,
      previousCenterValueRef,
      dispatch,
    );
  }, [derivedView.centerValue]);

  const visibleAsks = bookMode === "buy" ? EMPTY_ROWS : derivedView.asks;
  const visibleBids = bookMode === "sell" ? EMPTY_ROWS : derivedView.bids;

  useEffect(() => {
    if (previousRowFlashResetVersionRef.current === rowFlashResetVersion) {
      return;
    }

    previousRowFlashResetVersionRef.current = rowFlashResetVersion;
    previousRowSignaturesRef.current = new Map();
    clearFlashTimers();
  }, [clearFlashTimers, rowFlashResetVersion]);

  useEffect(() => {
    const visibleRows = [...visibleAsks, ...visibleBids];

    syncRowFlashTracking(
      visibleRows,
      previousRowSignaturesRef,
      flashTimersRef,
      dispatch,
      animationsEnabled,
    );
  }, [animationsEnabled, visibleAsks, visibleBids]);

  useEffect(() => {
    return () => {
      clearFlashTimers();
    };
  }, [clearFlashTimers]);

  const getOverlayData = useCallback(
    (rows: OrderBookRow[], index: number): OverlayData =>
      getOverlay(rows, index),
    [],
  );

  const getRowHighlightState = useCallback(
    (side: OrderBookSide, index: number): RowHighlightState =>
      getHighlightState(tableState.hoveredRow, side, index),
    [tableState.hoveredRow],
  );
  const actions = useMemo(() => createTableActionHandlers(dispatch), []);

  return {
    state: {
      isMenuOpen: tableState.isMenuOpen,
      isTickSizeOpen: tableState.isTickSizeOpen,
      hoveredRow: tableState.hoveredRow,
      showOverlayStats: tableState.showOverlayStats,
      showRatioBar: tableState.showRatioBar,
      roundingEnabled,
      depthMode: tableState.depthMode,
      bookMode,
      animationsEnabled,
      selectedTickSize,
    },
    data: {
      visibleAsks,
      visibleBids,
      centerPrice: derivedView.centerPrice,
      centerConvertedPrice: derivedView.centerConvertedPrice,
      centerPriceDirection: tableState.centerPriceDirection,
      buyRatio: derivedView.buyRatio,
      sellRatio: derivedView.sellRatio,
      isRowFlashing: (key: string) => tableState.flashingRowKeys[key] === true,
      getOverlay: getOverlayData,
      getRowHighlightState,
    },
    actions,
  };
}
