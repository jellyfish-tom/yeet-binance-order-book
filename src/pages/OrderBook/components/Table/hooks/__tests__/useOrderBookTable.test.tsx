import { describe, expect, it } from "bun:test";
import {
  type UseOrderBookTableArgs,
  useOrderBookTable,
} from "@pages/OrderBook/components/Table/hooks/useOrderBookTable/useOrderBookTable";
import { makeLevel } from "@pages/OrderBook/test-utils";
import { act, renderHook } from "@testing-library/react";

const defaultArgs: UseOrderBookTableArgs = {
  asks: [
    makeLevel(50100, 0.5, "ask"),
    makeLevel(50200, 1.0, "ask"),
    makeLevel(50300, 0.3, "ask"),
  ],
  bids: [
    makeLevel(50000, 0.8, "bid"),
    makeLevel(49900, 1.2, "bid"),
    makeLevel(49800, 0.4, "bid"),
  ],
  priceStep: "1",
  rowCount: 10,
  quoteAsset: "USDT",
  centerPricePrecision: 2,
};

describe("useOrderBookTable", () => {
  it("initialises with correct default state", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));
    const { state } = result.current;

    expect(state.isMenuOpen).toBe(false);
    expect(state.depthMode).toBe("amount");
    expect(state.bookMode).toBe("default");
    expect(state.roundingEnabled).toBe(true);
    expect(state.animationsEnabled).toBe(true);
    expect(state.selectedTickSize).toBe("1");
  });

  it("provides visibleAsks and visibleBids from derived view", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));
    expect(result.current.data.visibleAsks.length).toBeGreaterThan(0);
    expect(result.current.data.visibleBids.length).toBeGreaterThan(0);
  });

  it("hides asks in buy-only mode", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));

    act(() => {
      result.current.actions.handleSelectBuyMode();
    });

    expect(result.current.data.visibleAsks).toHaveLength(0);
    expect(result.current.data.visibleBids.length).toBeGreaterThan(0);
  });

  it("hides bids in sell-only mode", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));

    act(() => {
      result.current.actions.handleSelectSellMode();
    });

    expect(result.current.data.visibleBids).toHaveLength(0);
    expect(result.current.data.visibleAsks.length).toBeGreaterThan(0);
  });

  it("syncs selectedTickSize when priceStep prop changes", () => {
    const { result, rerender } = renderHook(
      (props: UseOrderBookTableArgs) => useOrderBookTable(props),
      { initialProps: defaultArgs },
    );

    expect(result.current.state.selectedTickSize).toBe("1");

    rerender({ ...defaultArgs, priceStep: "10" });

    expect(result.current.state.selectedTickSize).toBe("10");
  });

  it("getOverlay returns data for the hovered row index", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));
    const { visibleBids, getOverlay } = result.current.data;

    const overlay = getOverlay(visibleBids, 0);
    expect(overlay.avgPrice).toMatch(/^≈ /);
    expect(overlay.sumAmount).toBeTruthy();
    expect(overlay.sumTotal).toBeTruthy();
  });

  it("isRowFlashing returns false initially for all keys", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));
    expect(result.current.data.isRowFlashing("ask-50100")).toBe(false);
  });

  it("getRowHighlightState returns hovered for the hovered row", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));

    act(() => {
      result.current.actions.handleAskHoverStart(0);
    });

    expect(result.current.data.getRowHighlightState("ask", 0)).toBe("hovered");
  });

  it("getRowHighlightState returns related for other ask rows when one is hovered", () => {
    const { result } = renderHook(() => useOrderBookTable(defaultArgs));

    act(() => {
      result.current.actions.handleAskHoverStart(0);
    });

    // For asks: rows with index > hoveredIndex are "related" (farther from center)
    expect(result.current.data.getRowHighlightState("ask", 1)).toBe("related");
  });
});
