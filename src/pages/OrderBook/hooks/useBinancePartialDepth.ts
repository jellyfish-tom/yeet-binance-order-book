import {
  clearBookErrorMessage,
  createBookFromPayload,
  createHookState,
  updateBookStatus,
} from "@pages/OrderBook/hooks/useBinancePartialDepth/state";
import {
  BINANCE_PARTIAL_DEPTH_LEVELS,
  BINANCE_PARTIAL_DEPTH_SPEED_SUFFIX,
  type BinancePartialDepthMessage,
} from "@pages/OrderBook/model/binance";
import type { MarketSymbol } from "@pages/OrderBook/model/markets";
import type { UseBinancePartialDepthState } from "@pages/OrderBook/model/orderBook";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  clearTimer,
  closeSocket,
  connectPartialDepthSocket,
  resetBufferedPayload,
} from "@/pages/OrderBook/hooks/useBinancePartialDepth/socket";

export type UseBinancePartialDepthArgs = {
  symbol: MarketSymbol;
  levels?: string;
  speedSuffix?: string;
  enabled?: boolean;
};

export function useBinancePartialDepth({
  symbol,
  levels = BINANCE_PARTIAL_DEPTH_LEVELS,
  speedSuffix = BINANCE_PARTIAL_DEPTH_SPEED_SUFFIX,
  enabled = true,
}: UseBinancePartialDepthArgs) {
  const [state, setState] = useState<UseBinancePartialDepthState>(() =>
    createHookState(symbol, "idle", null, false, 0),
  );
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<number | null>(null);
  const flushTimerRef = useRef<number | null>(null);
  const latestPayloadRef = useRef<BinancePartialDepthMessage | null>(null);
  const hasRenderedPayloadRef = useRef(false);
  const generationRef = useRef(0);
  const restartConnectionRef = useRef<(() => void) | null>(null);

  const applyLivePayload = useCallback(
    (payload: BinancePartialDepthMessage, reconnectAttempt: number) => {
      setState(
        createHookState(
          symbol,
          "live",
          createBookFromPayload(symbol, payload),
          false,
          reconnectAttempt,
        ),
      );
      hasRenderedPayloadRef.current = true;
    },
    [symbol],
  );

  const applyConnectionState = useCallback(
    (
      connectionState: UseBinancePartialDepthState["connectionState"],
      reconnectAttempt: number,
      isStale: boolean,
      errorMessage: string | null = null,
    ) => {
      setState((current) =>
        createHookState(
          symbol,
          connectionState,
          updateBookStatus(current.book, symbol, connectionState, errorMessage),
          isStale,
          reconnectAttempt,
        ),
      );
    },
    [symbol],
  );

  useEffect(() => {
    if (!enabled) {
      restartConnectionRef.current = null;
      setState((current) => ({
        ...current,
        connectionState: "idle",
        activeSymbol: symbol,
      }));
      return;
    }

    let disposed = false;
    const generation = ++generationRef.current;

    const connect = (attempt: number) => {
      connectPartialDepthSocket({
        attempt,
        symbol,
        levels,
        speedSuffix,
        socketRef,
        reconnectTimerRef,
        flushTimerRef,
        latestPayloadRef,
        hasRenderedPayloadRef,
        disposed,
        generation,
        generationRef,
        applyConnectionState,
        applyLivePayload,
        connect,
      });
    };

    const restartConnection = () => {
      resetBufferedPayload(latestPayloadRef, hasRenderedPayloadRef);
      clearTimer(flushTimerRef);
      clearTimer(reconnectTimerRef);
      closeSocket(socketRef);
      connect(0);
    };

    restartConnectionRef.current = restartConnection;

    clearTimer(reconnectTimerRef);
    clearTimer(flushTimerRef);
    closeSocket(socketRef);
    connect(0);

    return () => {
      if (restartConnectionRef.current === restartConnection) {
        restartConnectionRef.current = null;
      }

      disposed = true;
      clearTimer(reconnectTimerRef);
      clearTimer(flushTimerRef);
      closeSocket(socketRef);
    };
  }, [
    enabled,
    levels,
    applyConnectionState,
    applyLivePayload,
    speedSuffix,
    symbol,
  ]);

  const retry = useCallback(() => {
    restartConnectionRef.current?.();
  }, []);

  const clearError = useCallback(() => {
    setState((current) => ({
      ...createHookState(
        symbol,
        current.book?.status === "live" ? "live" : current.connectionState,
        clearBookErrorMessage(current.book),
        current.isStale,
        current.reconnectAttempt,
      ),
    }));
  }, [symbol]);

  return {
    state,
    actions: {
      retry,
      clearError,
    },
  };
}
