import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { useBinancePartialDepth } from "@pages/OrderBook/hooks/useBinancePartialDepth";
import { act, renderHook, waitFor } from "@testing-library/react";

type WsEventHandler = (event: Event | MessageEvent | CloseEvent) => void;

interface MockWebSocket {
  url: string;
  onopen: WsEventHandler | null;
  onmessage: ((e: MessageEvent) => void) | null;
  onerror: ((e: Event) => void) | null;
  onclose: ((e: CloseEvent) => void) | null;
  close: ReturnType<typeof mock>;
  simulateOpen: () => void;
  simulateMessage: (data: object) => void;
  simulateError: () => void;
  simulateClose: (code?: number) => void;
}

let lastSocket: MockWebSocket | null = null;

const SYMBOL = "BTCUSDT" as Parameters<
  typeof useBinancePartialDepth
>[0]["symbol"];

function makePayload() {
  return {
    lastUpdateId: 1,
    bids: [["50000.00", "1.0"]],
    asks: [["50100.00", "0.5"]],
  };
}

beforeEach(() => {
  lastSocket = null;

  (globalThis as unknown as { WebSocket: unknown }).WebSocket = class MockWS {
    url: string;
    onopen: WsEventHandler | null = null;
    onmessage: ((e: MessageEvent) => void) | null = null;
    onerror: ((e: Event) => void) | null = null;
    onclose: ((e: CloseEvent) => void) | null = null;
    close = mock(() => {});

    constructor(url: string) {
      this.url = url;
      lastSocket = this as unknown as MockWebSocket;
    }

    simulateOpen() {
      this.onopen?.(new Event("open"));
    }
    simulateMessage(data: object) {
      this.onmessage?.(
        new MessageEvent("message", { data: JSON.stringify(data) }),
      );
    }
    simulateError() {
      this.onerror?.(new Event("error"));
    }
    simulateClose(code = 1006) {
      this.onclose?.(new CloseEvent("close", { code }));
    }
  };
});

afterEach(() => {
  delete (globalThis as unknown as { WebSocket?: unknown }).WebSocket;
});

describe("useBinancePartialDepth", () => {
  it("starts in idle state", () => {
    const { result } = renderHook(() =>
      useBinancePartialDepth({ symbol: SYMBOL, enabled: false }),
    );
    expect(result.current.state.connectionState).toBe("idle");
    expect(result.current.state.book).toBeNull();
  });

  it("transitions to connecting on mount when enabled", async () => {
    const { result } = renderHook(() =>
      useBinancePartialDepth({ symbol: SYMBOL }),
    );
    await waitFor(() => {
      expect(result.current.state.connectionState).toBe("connecting");
    });
  });

  it("transitions to live after receiving a valid message", async () => {
    const { result } = renderHook(() =>
      useBinancePartialDepth({ symbol: SYMBOL }),
    );

    await waitFor(() => expect(lastSocket).not.toBeNull());
    const socket = lastSocket;
    if (!socket) throw new Error("lastSocket unexpectedly null");

    act(() => {
      socket.simulateOpen();
      socket.simulateMessage(makePayload());
    });

    await waitFor(() => {
      expect(result.current.state.connectionState).toBe("live");
    });

    expect(result.current.state.book?.bids).toHaveLength(1);
    expect(result.current.state.book?.asks).toHaveLength(1);
  });

  it("clearError nullifies the errorMessage on the book", async () => {
    const { result } = renderHook(() =>
      useBinancePartialDepth({ symbol: SYMBOL }),
    );

    await waitFor(() => expect(lastSocket).not.toBeNull());
    const socket = lastSocket;
    if (!socket) throw new Error("lastSocket unexpectedly null");

    // Get to live state first
    act(() => {
      socket.simulateOpen();
      socket.simulateMessage(makePayload());
    });
    await waitFor(() =>
      expect(result.current.state.connectionState).toBe("live"),
    );

    // Simulate an error close to set an error message
    act(() => {
      socket.simulateError();
    });

    act(() => {
      result.current.actions.clearError();
    });

    await waitFor(() => {
      expect(result.current.state.book?.errorMessage).toBeNull();
    });
  });

  it("sets connectionState to idle when disabled", async () => {
    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useBinancePartialDepth({ symbol: SYMBOL, enabled }),
      { initialProps: { enabled: true } },
    );

    await waitFor(() => expect(lastSocket).not.toBeNull());

    rerender({ enabled: false });

    await waitFor(() => {
      expect(result.current.state.connectionState).toBe("idle");
    });
  });

  it("closes socket on unmount", async () => {
    const { unmount } = renderHook(() =>
      useBinancePartialDepth({ symbol: SYMBOL }),
    );

    await waitFor(() => expect(lastSocket).not.toBeNull());
    const socket = lastSocket;
    if (!socket) throw new Error("lastSocket unexpectedly null");

    unmount();

    expect(socket.close).toHaveBeenCalled();
  });
});
