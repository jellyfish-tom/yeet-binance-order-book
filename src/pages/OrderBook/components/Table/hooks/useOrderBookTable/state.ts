import {
  TABLE_STATE_ACTION_TYPE,
  type TableState,
  type TableStateAction,
  type TableStateDispatch,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/types";
import { getTickSize } from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/utils";
import type { TickSize } from "@pages/OrderBook/model/orderBook";

function toggleBoolean(value: boolean) {
  return !value;
}

function createRowFlashResetState(state: TableState) {
  return {
    flashingRowKeys: {},
    rowFlashResetVersion: state.rowFlashResetVersion + 1,
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled table state action: ${JSON.stringify(value)}`);
}

export function createInitialTableState(priceStep: TickSize): TableState {
  return {
    isMenuOpen: false,
    isTickSizeOpen: false,
    hoveredRow: null,
    showOverlayStats: true,
    showRatioBar: true,
    roundingEnabled: true,
    depthMode: "amount",
    bookMode: "default",
    animationsEnabled: true,
    flashingRowKeys: {},
    rowFlashResetVersion: 0,
    centerPriceDirection: "down",
    selectedTickSize: getTickSize(priceStep),
  };
}

export function tableStateReducer(
  state: TableState,
  action: TableStateAction,
): TableState {
  switch (action.type) {
    case TABLE_STATE_ACTION_TYPE.setMenuOpen: {
      return {
        ...state,
        isMenuOpen: action.open,
        isTickSizeOpen: action.open ? false : state.isTickSizeOpen,
      };
    }

    case TABLE_STATE_ACTION_TYPE.setTickSizeOpen: {
      return {
        ...state,
        isTickSizeOpen: action.open,
        isMenuOpen: action.open ? false : state.isMenuOpen,
      };
    }

    case TABLE_STATE_ACTION_TYPE.toggleOverlayStats: {
      return {
        ...state,
        showOverlayStats: toggleBoolean(state.showOverlayStats),
      };
    }

    case TABLE_STATE_ACTION_TYPE.toggleRatioBar: {
      return {
        ...state,
        showRatioBar: toggleBoolean(state.showRatioBar),
      };
    }

    case TABLE_STATE_ACTION_TYPE.toggleRounding: {
      return {
        ...state,
        roundingEnabled: toggleBoolean(state.roundingEnabled),
        ...createRowFlashResetState(state),
      };
    }

    case TABLE_STATE_ACTION_TYPE.setDepthMode: {
      return {
        ...state,
        depthMode: action.depthMode,
      };
    }

    case TABLE_STATE_ACTION_TYPE.toggleAnimations: {
      return {
        ...state,
        animationsEnabled: toggleBoolean(state.animationsEnabled),
        ...createRowFlashResetState(state),
      };
    }

    case TABLE_STATE_ACTION_TYPE.setBookMode: {
      return {
        ...state,
        bookMode: action.bookMode,
        ...createRowFlashResetState(state),
      };
    }

    case TABLE_STATE_ACTION_TYPE.syncSelectedTickSize: {
      if (state.selectedTickSize === action.tickSize) {
        return state;
      }

      return {
        ...state,
        selectedTickSize: action.tickSize,
        ...createRowFlashResetState(state),
      };
    }

    case TABLE_STATE_ACTION_TYPE.selectTickSize: {
      const tickSizeAlreadySelectedWithMenuClosed =
        state.selectedTickSize === action.tickSize && !state.isTickSizeOpen;

      if (tickSizeAlreadySelectedWithMenuClosed) {
        return state;
      }

      return {
        ...state,
        selectedTickSize: action.tickSize,
        isTickSizeOpen: false,
        ...createRowFlashResetState(state),
      };
    }

    case TABLE_STATE_ACTION_TYPE.hoverRowStart: {
      return {
        ...state,
        hoveredRow: {
          side: action.side,
          index: action.index,
        },
      };
    }

    case TABLE_STATE_ACTION_TYPE.hoverRowEnd: {
      const isCurrentRow =
        state.hoveredRow?.side === action.side &&
        state.hoveredRow.index === action.index;

      return {
        ...state,
        hoveredRow: isCurrentRow ? null : state.hoveredRow,
      };
    }

    case TABLE_STATE_ACTION_TYPE.setCenterPriceDirection: {
      return {
        ...state,
        centerPriceDirection: action.direction,
      };
    }

    case TABLE_STATE_ACTION_TYPE.markFlashingRows: {
      const flashingRowKeys = { ...state.flashingRowKeys };

      for (const key of action.keys) {
        flashingRowKeys[key] = true;
      }

      return {
        ...state,
        flashingRowKeys,
      };
    }

    case TABLE_STATE_ACTION_TYPE.clearFlashingRow: {
      if (!(action.key in state.flashingRowKeys)) {
        return state;
      }

      const flashingRowKeys = { ...state.flashingRowKeys };
      delete flashingRowKeys[action.key];

      return {
        ...state,
        flashingRowKeys,
      };
    }

    case TABLE_STATE_ACTION_TYPE.resetFlashingRows: {
      return {
        ...state,
        flashingRowKeys: {},
      };
    }

    default:
      return assertNever(action);
  }
}

export function createTableActionHandlers(dispatch: TableStateDispatch) {
  return {
    handleMenuOpenChange: (open: boolean) =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.setMenuOpen, open }),
    handleTickSizeOpenChange: (open: boolean) =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.setTickSizeOpen, open }),
    handleToggleOverlayStats: () =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.toggleOverlayStats }),
    handleToggleRatioBar: () =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.toggleRatioBar }),
    handleToggleRounding: () =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.toggleRounding }),
    handleSetDepthModeAmount: () =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.setDepthMode,
        depthMode: "amount",
      }),
    handleSetDepthModeCumulative: () =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.setDepthMode,
        depthMode: "cumulative",
      }),
    handleToggleAnimations: () =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.toggleAnimations }),
    handleSelectDefaultMode: () =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.setBookMode,
        bookMode: "default",
      }),
    handleSelectBuyMode: () =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.setBookMode, bookMode: "buy" }),
    handleSelectSellMode: () =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.setBookMode, bookMode: "sell" }),
    handleSelectTickSize: (tickSize: TickSize) =>
      dispatch({ type: TABLE_STATE_ACTION_TYPE.selectTickSize, tickSize }),
    handleAskHoverStart: (index: number) =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.hoverRowStart,
        side: "ask",
        index,
      }),
    handleBidHoverStart: (index: number) =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.hoverRowStart,
        side: "bid",
        index,
      }),
    handleAskHoverEnd: (index: number) =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.hoverRowEnd,
        side: "ask",
        index,
      }),
    handleBidHoverEnd: (index: number) =>
      dispatch({
        type: TABLE_STATE_ACTION_TYPE.hoverRowEnd,
        side: "bid",
        index,
      }),
  };
}
