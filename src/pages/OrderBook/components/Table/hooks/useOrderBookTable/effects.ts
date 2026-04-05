import type {
  HoveredRow,
  RowHighlightState,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/types";
import {
  TABLE_STATE_ACTION_TYPE,
  type TableStateDispatch,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/types";
import { getTickSize } from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/utils";
import type {
  OrderBookRow,
  OrderBookSide,
  TickSize,
} from "@pages/OrderBook/model/orderBook";
import type { RefObject } from "react";

const ROW_FLASH_DURATION = 520;

function getRowKey(row: OrderBookRow) {
  return row.key ?? `${row.side}-${row.price}`;
}

function getRowSignature(row: OrderBookRow) {
  return `${row.price}:${row.amount}:${row.total}`;
}

function collectChangedRowKeys(
  visibleRows: OrderBookRow[],
  previousRowSignatures: Map<string, string>,
) {
  const nextSignatures = new Map<string, string>();
  const changedKeys = new Set<string>();

  for (const row of visibleRows) {
    const key = getRowKey(row);
    const signature = getRowSignature(row);
    const previousSignature = previousRowSignatures.get(key);
    const hasRowChanged =
      previousSignature !== undefined && previousSignature !== signature;

    nextSignatures.set(key, signature);

    if (hasRowChanged) {
      changedKeys.add(key);
    }
  }

  return {
    nextSignatures,
    changedKeys,
  };
}

function collectRowSignatures(visibleRows: OrderBookRow[]) {
  const nextSignatures = new Map<string, string>();

  for (const row of visibleRows) {
    nextSignatures.set(getRowKey(row), getRowSignature(row));
  }

  return nextSignatures;
}

function markRowsAsFlashing(
  changedKeys: Set<string>,
  dispatch: TableStateDispatch,
) {
  dispatch({
    type: TABLE_STATE_ACTION_TYPE.markFlashingRows,
    keys: [...changedKeys],
  });
}

function clearRowFlash(key: string, dispatch: TableStateDispatch) {
  dispatch({ type: TABLE_STATE_ACTION_TYPE.clearFlashingRow, key });
}

function scheduleRowFlashCleanup(
  key: string,
  flashTimersRef: RefObject<Map<string, number>>,
  dispatch: TableStateDispatch,
) {
  const currentTimer = flashTimersRef.current.get(key);

  if (currentTimer !== undefined) {
    window.clearTimeout(currentTimer);
  }

  const timer = window.setTimeout(() => {
    flashTimersRef.current.delete(key);
    clearRowFlash(key, dispatch);
  }, ROW_FLASH_DURATION);

  flashTimersRef.current.set(key, timer);
}

export function syncSelectedTickSize(
  priceStep: TickSize,
  dispatch: TableStateDispatch,
) {
  dispatch({
    type: TABLE_STATE_ACTION_TYPE.syncSelectedTickSize,
    tickSize: getTickSize(priceStep),
  });
}

export function syncCenterPriceDirection(
  nextCenterValue: number | null,
  previousCenterValueRef: RefObject<number | null>,
  dispatch: TableStateDispatch,
) {
  if (nextCenterValue === null) {
    return;
  }

  const previousCenterValue = previousCenterValueRef.current;

  if (previousCenterValue !== null) {
    if (nextCenterValue > previousCenterValue) {
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.setCenterPriceDirection,
        direction: "up",
      });
    } else if (nextCenterValue < previousCenterValue) {
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.setCenterPriceDirection,
        direction: "down",
      });
    }
  }

  previousCenterValueRef.current = nextCenterValue;
}

export function syncRowFlashTracking(
  visibleRows: OrderBookRow[],
  previousRowSignaturesRef: RefObject<Map<string, string>>,
  flashTimersRef: RefObject<Map<string, number>>,
  dispatch: TableStateDispatch,
  animationsEnabled: boolean,
) {
  if (!animationsEnabled) {
    previousRowSignaturesRef.current = collectRowSignatures(visibleRows);
    return;
  }

  const hasPreviousRows = previousRowSignaturesRef.current.size > 0;
  const { nextSignatures, changedKeys } = collectChangedRowKeys(
    visibleRows,
    previousRowSignaturesRef.current,
  );
  const shouldSkipRowFlash = !hasPreviousRows || changedKeys.size === 0;

  previousRowSignaturesRef.current = nextSignatures;

  if (shouldSkipRowFlash) {
    return;
  }

  markRowsAsFlashing(changedKeys, dispatch);

  for (const key of changedKeys) {
    scheduleRowFlashCleanup(key, flashTimersRef, dispatch);
  }
}

export function getHighlightState(
  hoveredRow: HoveredRow | null,
  side: OrderBookSide,
  index: number,
): RowHighlightState {
  const isHoveredRowMissingForSide = !hoveredRow || hoveredRow.side !== side;

  if (isHoveredRowMissingForSide) {
    return "idle";
  }

  if (hoveredRow.index === index) {
    return "hovered";
  }

  const isRelatedRow =
    side === "ask" ? index > hoveredRow.index : index < hoveredRow.index;

  return isRelatedRow ? "related" : "idle";
}
