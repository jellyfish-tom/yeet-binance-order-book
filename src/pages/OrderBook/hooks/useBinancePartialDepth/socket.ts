import {
  type BinancePartialDepthMessage,
  createPartialDepthStreamUrl,
} from "@pages/OrderBook/model/binance";
import type { MarketSymbol } from "@pages/OrderBook/model/markets";
import type { UseBinancePartialDepthState } from "@pages/OrderBook/model/orderBook";
import type { RefObject } from "react";

export const MAX_RECONNECT_DELAY = 5000;
export const DISPLAY_FLUSH_INTERVAL = 240;
export const WS_READ_ERROR_MESSAGE = "Failed to read from Binance websocket.";

export function clearTimer(timerRef: RefObject<number | null>) {
  if (timerRef.current !== null) {
    window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }
}

export function closeSocket(socketRef: RefObject<WebSocket | null>) {
  if (!socketRef.current) {
    return;
  }

  socketRef.current.close(1000, "cleanup");
  socketRef.current = null;
}

export function resetBufferedPayload(
  latestPayloadRef: RefObject<BinancePartialDepthMessage | null>,
  hasRenderedPayloadRef: RefObject<boolean>,
) {
  hasRenderedPayloadRef.current = false;
  latestPayloadRef.current = null;
}

export function getConnectionStateForAttempt(
  attempt: number,
): UseBinancePartialDepthState["connectionState"] {
  return attempt === 0 ? "connecting" : "reconnecting";
}

export function shouldIgnoreSocketEvent(
  disposed: boolean,
  generation: number,
  generationRef: RefObject<number>,
) {
  return disposed || generation !== generationRef.current;
}

export function parsePartialDepthMessage(
  rawData: unknown,
): BinancePartialDepthMessage | null {
  try {
    const payload = JSON.parse(String(rawData)) as BinancePartialDepthMessage;
    const hasDepthArrays =
      Array.isArray(payload.bids) && Array.isArray(payload.asks);

    if (!hasDepthArrays) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function flushBufferedPayload({
  attempt,
  flushTimerRef,
  latestPayloadRef,
  disposed,
  generation,
  generationRef,
  applyLivePayload,
}: {
  attempt: number;
  flushTimerRef: RefObject<number | null>;
  latestPayloadRef: RefObject<BinancePartialDepthMessage | null>;
  disposed: boolean;
  generation: number;
  generationRef: RefObject<number>;
  applyLivePayload: (
    payload: BinancePartialDepthMessage,
    reconnectAttempt: number,
  ) => void;
}) {
  clearTimer(flushTimerRef);
  const payload = latestPayloadRef.current;
  const shouldSkipFlush =
    !payload || shouldIgnoreSocketEvent(disposed, generation, generationRef);

  if (shouldSkipFlush) {
    return;
  }

  applyLivePayload(payload, attempt);
}

export function scheduleReconnect({
  attempt,
  reconnectTimerRef,
  flushTimerRef,
  connect,
}: {
  attempt: number;
  reconnectTimerRef: RefObject<number | null>;
  flushTimerRef: RefObject<number | null>;
  connect: (attempt: number) => void;
}) {
  const delay = Math.min(1000 * 2 ** attempt, MAX_RECONNECT_DELAY);

  clearTimer(reconnectTimerRef);
  clearTimer(flushTimerRef);
  reconnectTimerRef.current = window.setTimeout(() => {
    connect(attempt + 1);
  }, delay);
}

function scheduleBufferedFlush({
  attempt,
  flushTimerRef,
  latestPayloadRef,
  disposed,
  generation,
  generationRef,
  applyLivePayload,
}: {
  attempt: number;
  flushTimerRef: RefObject<number | null>;
  latestPayloadRef: RefObject<BinancePartialDepthMessage | null>;
  disposed: boolean;
  generation: number;
  generationRef: RefObject<number>;
  applyLivePayload: (
    payload: BinancePartialDepthMessage,
    reconnectAttempt: number,
  ) => void;
}) {
  if (flushTimerRef.current === null) {
    flushTimerRef.current = window.setTimeout(() => {
      flushBufferedPayload({
        attempt,
        flushTimerRef,
        latestPayloadRef,
        disposed,
        generation,
        generationRef,
        applyLivePayload,
      });
    }, DISPLAY_FLUSH_INTERVAL);
  }
}

function handleSocketMessage({
  event,
  attempt,
  disposed,
  generation,
  generationRef,
  latestPayloadRef,
  hasRenderedPayloadRef,
  flushTimerRef,
  applyLivePayload,
}: {
  event: MessageEvent;
  attempt: number;
  disposed: boolean;
  generation: number;
  generationRef: RefObject<number>;
  latestPayloadRef: RefObject<BinancePartialDepthMessage | null>;
  hasRenderedPayloadRef: RefObject<boolean>;
  flushTimerRef: RefObject<number | null>;
  applyLivePayload: (
    payload: BinancePartialDepthMessage,
    reconnectAttempt: number,
  ) => void;
}) {
  const isStaleSocketEvent = shouldIgnoreSocketEvent(
    disposed,
    generation,
    generationRef,
  );

  if (isStaleSocketEvent) {
    return;
  }

  const payload = parsePartialDepthMessage(event.data);

  if (!payload) {
    return;
  }

  latestPayloadRef.current = payload;

  if (!hasRenderedPayloadRef.current) {
    flushBufferedPayload({
      attempt,
      flushTimerRef,
      latestPayloadRef,
      disposed,
      generation,
      generationRef,
      applyLivePayload,
    });
    return;
  }

  scheduleBufferedFlush({
    attempt,
    flushTimerRef,
    latestPayloadRef,
    disposed,
    generation,
    generationRef,
    applyLivePayload,
  });
}

function handleSocketError({
  attempt,
  disposed,
  generation,
  generationRef,
  applyConnectionState,
}: {
  attempt: number;
  disposed: boolean;
  generation: number;
  generationRef: RefObject<number>;
  applyConnectionState: (
    connectionState: UseBinancePartialDepthState["connectionState"],
    reconnectAttempt: number,
    isStale: boolean,
    errorMessage?: string | null,
  ) => void;
}) {
  const isStaleSocketEvent = shouldIgnoreSocketEvent(
    disposed,
    generation,
    generationRef,
  );

  if (isStaleSocketEvent) {
    return;
  }

  applyConnectionState("error", attempt, true, WS_READ_ERROR_MESSAGE);
}

function handleSocketClose({
  attempt,
  disposed,
  generation,
  generationRef,
  reconnectTimerRef,
  flushTimerRef,
  applyConnectionState,
  connect,
}: {
  attempt: number;
  disposed: boolean;
  generation: number;
  generationRef: RefObject<number>;
  reconnectTimerRef: RefObject<number | null>;
  flushTimerRef: RefObject<number | null>;
  applyConnectionState: (
    connectionState: UseBinancePartialDepthState["connectionState"],
    reconnectAttempt: number,
    isStale: boolean,
    errorMessage?: string | null,
  ) => void;
  connect: (attempt: number) => void;
}) {
  const isStaleSocketEvent = shouldIgnoreSocketEvent(
    disposed,
    generation,
    generationRef,
  );

  if (isStaleSocketEvent) {
    return;
  }

  applyConnectionState("reconnecting", attempt + 1, true);
  scheduleReconnect({
    attempt,
    reconnectTimerRef,
    flushTimerRef,
    connect,
  });
}

export function connectPartialDepthSocket({
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
}: {
  attempt: number;
  symbol: MarketSymbol;
  levels: string;
  speedSuffix: string;
  socketRef: RefObject<WebSocket | null>;
  reconnectTimerRef: RefObject<number | null>;
  flushTimerRef: RefObject<number | null>;
  latestPayloadRef: RefObject<BinancePartialDepthMessage | null>;
  hasRenderedPayloadRef: RefObject<boolean>;
  disposed: boolean;
  generation: number;
  generationRef: RefObject<number>;
  applyConnectionState: (
    connectionState: UseBinancePartialDepthState["connectionState"],
    reconnectAttempt: number,
    isStale: boolean,
    errorMessage?: string | null,
  ) => void;
  applyLivePayload: (
    payload: BinancePartialDepthMessage,
    reconnectAttempt: number,
  ) => void;
  connect: (attempt: number) => void;
}) {
  if (disposed) {
    return;
  }

  const status = getConnectionStateForAttempt(attempt);

  resetBufferedPayload(latestPayloadRef, hasRenderedPayloadRef);
  applyConnectionState(status, attempt, attempt > 0);

  const socket = new WebSocket(
    createPartialDepthStreamUrl(symbol, levels, speedSuffix),
  );
  socketRef.current = socket;

  socket.onmessage = (event) => {
    handleSocketMessage({
      event,
      attempt,
      disposed,
      generation,
      generationRef,
      latestPayloadRef,
      hasRenderedPayloadRef,
      flushTimerRef,
      applyLivePayload,
    });
  };

  socket.onerror = () => {
    handleSocketError({
      attempt,
      disposed,
      generation,
      generationRef,
      applyConnectionState,
    });
  };

  socket.onclose = () => {
    handleSocketClose({
      attempt,
      disposed,
      generation,
      generationRef,
      reconnectTimerRef,
      flushTimerRef,
      applyConnectionState,
      connect,
    });
  };
}
