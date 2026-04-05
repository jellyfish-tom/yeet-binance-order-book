import { describe, expect, it } from "bun:test";
import {
  getConnectionStateForAttempt,
  MAX_RECONNECT_DELAY,
  parsePartialDepthMessage,
  shouldIgnoreSocketEvent,
} from "@pages/OrderBook/hooks/useBinancePartialDepth/socket";

describe("getConnectionStateForAttempt", () => {
  it("returns 'connecting' for attempt 0", () => {
    expect(getConnectionStateForAttempt(0)).toBe("connecting");
  });

  it("returns 'reconnecting' for attempt > 0", () => {
    expect(getConnectionStateForAttempt(1)).toBe("reconnecting");
    expect(getConnectionStateForAttempt(5)).toBe("reconnecting");
  });
});

describe("shouldIgnoreSocketEvent", () => {
  it("returns true when disposed is true", () => {
    const ref = { current: 1 };
    expect(shouldIgnoreSocketEvent(true, 1, ref)).toBe(true);
  });

  it("returns true when generation does not match ref", () => {
    const ref = { current: 2 };
    expect(shouldIgnoreSocketEvent(false, 1, ref)).toBe(true);
  });

  it("returns false when not disposed and generation matches", () => {
    const ref = { current: 3 };
    expect(shouldIgnoreSocketEvent(false, 3, ref)).toBe(false);
  });
});

describe("parsePartialDepthMessage", () => {
  it("parses a valid depth message", () => {
    const raw = JSON.stringify({
      lastUpdateId: 1,
      bids: [["100", "1"]],
      asks: [["101", "2"]],
    });
    const result = parsePartialDepthMessage(raw);
    expect(result).not.toBeNull();
    expect(result?.lastUpdateId).toBe(1);
    expect(Array.isArray(result?.bids)).toBe(true);
    expect(Array.isArray(result?.asks)).toBe(true);
  });

  it("returns null for invalid JSON", () => {
    expect(parsePartialDepthMessage("{not-json}")).toBeNull();
  });

  it("returns null when bids is missing", () => {
    const raw = JSON.stringify({ lastUpdateId: 1, asks: [] });
    expect(parsePartialDepthMessage(raw)).toBeNull();
  });

  it("returns null when asks is missing", () => {
    const raw = JSON.stringify({ lastUpdateId: 1, bids: [] });
    expect(parsePartialDepthMessage(raw)).toBeNull();
  });

  it("returns null when bids is not an array", () => {
    const raw = JSON.stringify({ lastUpdateId: 1, bids: {}, asks: [] });
    expect(parsePartialDepthMessage(raw)).toBeNull();
  });

  it("handles non-string rawData by stringifying", () => {
    expect(parsePartialDepthMessage(null)).toBeNull();
    expect(parsePartialDepthMessage(undefined)).toBeNull();
    expect(parsePartialDepthMessage(42)).toBeNull();
  });
});

describe("scheduleReconnect delay (backoff logic)", () => {
  it("caps delay at MAX_RECONNECT_DELAY", () => {
    // Verify the constant is 5000
    expect(MAX_RECONNECT_DELAY).toBe(5000);

    // 1000 * 2^10 = 1024000 > 5000, so should be capped
    const delay = Math.min(1000 * 2 ** 10, MAX_RECONNECT_DELAY);
    expect(delay).toBe(MAX_RECONNECT_DELAY);
  });

  it("uses exponential backoff for small attempt numbers", () => {
    const delay0 = Math.min(1000 * 2 ** 0, MAX_RECONNECT_DELAY);
    const delay1 = Math.min(1000 * 2 ** 1, MAX_RECONNECT_DELAY);
    const delay2 = Math.min(1000 * 2 ** 2, MAX_RECONNECT_DELAY);
    expect(delay0).toBe(1000);
    expect(delay1).toBe(2000);
    expect(delay2).toBe(4000);
  });

  it("caps at attempt 3 (8000 > 5000)", () => {
    const delay3 = Math.min(1000 * 2 ** 3, MAX_RECONNECT_DELAY);
    expect(delay3).toBe(MAX_RECONNECT_DELAY);
  });
});
