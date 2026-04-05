import { describe, expect, it } from "bun:test";
import {
  createInitialTableState,
  tableStateReducer,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/state";
import {
  TABLE_STATE_ACTION_TYPE,
  type TableState,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/types";

function getInitial(): TableState {
  return createInitialTableState("0.01");
}

describe("createInitialTableState", () => {
  it("creates state with expected defaults", () => {
    const state = getInitial();
    expect(state.isMenuOpen).toBe(false);
    expect(state.isTickSizeOpen).toBe(false);
    expect(state.hoveredRow).toBeNull();
    expect(state.showOverlayStats).toBe(true);
    expect(state.showRatioBar).toBe(true);
    expect(state.roundingEnabled).toBe(true);
    expect(state.depthMode).toBe("amount");
    expect(state.bookMode).toBe("default");
    expect(state.animationsEnabled).toBe(true);
    expect(state.flashingRowKeys).toEqual({});
    expect(state.rowFlashResetVersion).toBe(0);
    expect(state.centerPriceDirection).toBe("down");
  });

  it("sets selectedTickSize from priceStep argument", () => {
    expect(createInitialTableState("1").selectedTickSize).toBe("1");
    expect(createInitialTableState("0.1").selectedTickSize).toBe("0.1");
  });
});

describe("tableStateReducer", () => {
  describe("setMenuOpen", () => {
    it("opens the menu", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.setMenuOpen,
        open: true,
      });
      expect(next.isMenuOpen).toBe(true);
    });

    it("closes tick size panel when menu opens", () => {
      const state = { ...getInitial(), isTickSizeOpen: true };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.setMenuOpen,
        open: true,
      });
      expect(next.isTickSizeOpen).toBe(false);
    });
  });

  describe("setTickSizeOpen", () => {
    it("opens the tick size panel", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.setTickSizeOpen,
        open: true,
      });
      expect(next.isTickSizeOpen).toBe(true);
    });

    it("closes menu when tick size panel opens", () => {
      const state = { ...getInitial(), isMenuOpen: true };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.setTickSizeOpen,
        open: true,
      });
      expect(next.isMenuOpen).toBe(false);
    });
  });

  describe("toggleOverlayStats", () => {
    it("toggles showOverlayStats", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.toggleOverlayStats,
      });
      expect(next.showOverlayStats).toBe(false);
    });
  });

  describe("toggleRatioBar", () => {
    it("toggles showRatioBar", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.toggleRatioBar,
      });
      expect(next.showRatioBar).toBe(false);
    });
  });

  describe("toggleRounding", () => {
    it("toggles roundingEnabled", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.toggleRounding,
      });
      expect(next.roundingEnabled).toBe(false);
    });

    it("increments rowFlashResetVersion", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.toggleRounding,
      });
      expect(next.rowFlashResetVersion).toBe(1);
    });

    it("clears flashingRowKeys", () => {
      const state = {
        ...getInitial(),
        flashingRowKeys: { "ask-100": true as const },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.toggleRounding,
      });
      expect(next.flashingRowKeys).toEqual({});
    });
  });

  describe("setDepthMode", () => {
    it("sets depthMode to cumulative", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.setDepthMode,
        depthMode: "cumulative",
      });
      expect(next.depthMode).toBe("cumulative");
    });
  });

  describe("toggleAnimations", () => {
    it("toggles animationsEnabled", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.toggleAnimations,
      });
      expect(next.animationsEnabled).toBe(false);
    });

    it("resets flash tracking", () => {
      const state = {
        ...getInitial(),
        flashingRowKeys: { "bid-99": true as const },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.toggleAnimations,
      });
      expect(next.flashingRowKeys).toEqual({});
      expect(next.rowFlashResetVersion).toBe(1);
    });
  });

  describe("setBookMode", () => {
    it("sets bookMode", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.setBookMode,
        bookMode: "buy",
      });
      expect(next.bookMode).toBe("buy");
    });

    it("resets flash tracking", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.setBookMode,
        bookMode: "sell",
      });
      expect(next.rowFlashResetVersion).toBe(1);
    });
  });

  describe("syncSelectedTickSize", () => {
    it("updates selectedTickSize when changed", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.syncSelectedTickSize,
        tickSize: "1",
      });
      expect(next.selectedTickSize).toBe("1");
    });

    it("returns same reference when tick size is unchanged", () => {
      const state = getInitial();
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.syncSelectedTickSize,
        tickSize: state.selectedTickSize,
      });
      expect(next).toBe(state);
    });
  });

  describe("selectTickSize", () => {
    it("selects a new tick size and closes tick size panel", () => {
      const state = { ...getInitial(), isTickSizeOpen: true };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.selectTickSize,
        tickSize: "10",
      });
      expect(next.selectedTickSize).toBe("10");
      expect(next.isTickSizeOpen).toBe(false);
    });

    it("returns same state when same tick size selected and panel already closed", () => {
      const state = getInitial(); // isTickSizeOpen: false
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.selectTickSize,
        tickSize: state.selectedTickSize,
      });
      expect(next).toBe(state);
    });
  });

  describe("hoverRowStart / hoverRowEnd", () => {
    it("sets hoveredRow on hoverRowStart", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.hoverRowStart,
        side: "ask",
        index: 3,
      });
      expect(next.hoveredRow).toEqual({ side: "ask", index: 3 });
    });

    it("clears hoveredRow on hoverRowEnd for the current row", () => {
      const state = {
        ...getInitial(),
        hoveredRow: { side: "ask" as const, index: 3 },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.hoverRowEnd,
        side: "ask",
        index: 3,
      });
      expect(next.hoveredRow).toBeNull();
    });

    it("keeps hoveredRow when hoverRowEnd is for a different row", () => {
      const state = {
        ...getInitial(),
        hoveredRow: { side: "ask" as const, index: 3 },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.hoverRowEnd,
        side: "ask",
        index: 5,
      });
      expect(next.hoveredRow).toEqual({ side: "ask", index: 3 });
    });
  });

  describe("setCenterPriceDirection", () => {
    it("sets direction to up", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.setCenterPriceDirection,
        direction: "up",
      });
      expect(next.centerPriceDirection).toBe("up");
    });
  });

  describe("markFlashingRows", () => {
    it("adds keys to flashingRowKeys", () => {
      const next = tableStateReducer(getInitial(), {
        type: TABLE_STATE_ACTION_TYPE.markFlashingRows,
        keys: ["ask-100", "bid-99"],
      });
      expect(next.flashingRowKeys["ask-100"]).toBe(true);
      expect(next.flashingRowKeys["bid-99"]).toBe(true);
    });

    it("merges with existing flashing keys", () => {
      const state = {
        ...getInitial(),
        flashingRowKeys: { "ask-200": true as const },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.markFlashingRows,
        keys: ["bid-50"],
      });
      expect(next.flashingRowKeys["ask-200"]).toBe(true);
      expect(next.flashingRowKeys["bid-50"]).toBe(true);
    });
  });

  describe("clearFlashingRow", () => {
    it("removes the specified key", () => {
      const state = {
        ...getInitial(),
        flashingRowKeys: { "ask-100": true as const, "bid-99": true as const },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.clearFlashingRow,
        key: "ask-100",
      });
      expect("ask-100" in next.flashingRowKeys).toBe(false);
      expect(next.flashingRowKeys["bid-99"]).toBe(true);
    });

    it("returns same reference when key does not exist", () => {
      const state = getInitial();
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.clearFlashingRow,
        key: "nonexistent",
      });
      expect(next).toBe(state);
    });
  });

  describe("resetFlashingRows", () => {
    it("clears all flashing keys", () => {
      const state = {
        ...getInitial(),
        flashingRowKeys: { "ask-100": true as const, "bid-99": true as const },
      };
      const next = tableStateReducer(state, {
        type: TABLE_STATE_ACTION_TYPE.resetFlashingRows,
      });
      expect(next.flashingRowKeys).toEqual({});
    });
  });
});
