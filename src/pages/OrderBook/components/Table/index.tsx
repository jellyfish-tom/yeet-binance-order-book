import { Popover } from "@components/Popover";
import {
  TableColumnsHeader,
  TableHeader,
  TableMenu,
  TableMidPrice,
  TableRatioSection,
  TableRows,
  TableToolbar,
} from "@pages/OrderBook/components/Table/components";
import { useOrderBookTable } from "@pages/OrderBook/components/Table/hooks";
import type {
  NormalizedDepthLevel,
  OrderBookConnectionState,
  TickSize,
} from "@pages/OrderBook/model/orderBook";

type TableProps = {
  asks: NormalizedDepthLevel[];
  bids: NormalizedDepthLevel[];
  priceStep: TickSize;
  rowCount: number;
  baseAsset: string;
  quoteAsset: string;
  centerPricePrecision: number;
  connectionState: OrderBookConnectionState;
  errorMessage?: string | null;
};

export function Table({
  asks,
  bids,
  priceStep,
  rowCount,
  baseAsset,
  quoteAsset,
  centerPricePrecision,
  connectionState,
  errorMessage,
}: TableProps) {
  const { state, data, actions } = useOrderBookTable({
    asks,
    bids,
    priceStep,
    rowCount,
    quoteAsset,
    centerPricePrecision,
  });

  return (
    <section className="relative overflow-visible rounded-[8px] bg-(--panel-bg)">
      <Popover.Root
        open={state.isMenuOpen}
        onOpenChange={actions.handleMenuOpenChange}
      >
        {/* shorthand notation? */}
        <TableHeader
          connectionState={connectionState}
          errorMessage={errorMessage}
        />

        <TableMenu
          showOverlayStats={state.showOverlayStats}
          showRatioBar={state.showRatioBar}
          roundingEnabled={state.roundingEnabled}
          depthMode={state.depthMode}
          animationsEnabled={state.animationsEnabled}
          onToggleOverlayStats={actions.handleToggleOverlayStats}
          onToggleRatioBar={actions.handleToggleRatioBar}
          onToggleRounding={actions.handleToggleRounding}
          onSetDepthModeAmount={actions.handleSetDepthModeAmount}
          onSetDepthModeCumulative={actions.handleSetDepthModeCumulative}
          onToggleAnimations={actions.handleToggleAnimations}
        />
      </Popover.Root>

      <TableToolbar
        bookMode={state.bookMode}
        isTickSizeOpen={state.isTickSizeOpen}
        selectedTickSize={state.selectedTickSize}
        onSelectDefaultMode={actions.handleSelectDefaultMode}
        onSelectBuyMode={actions.handleSelectBuyMode}
        onSelectSellMode={actions.handleSelectSellMode}
        onTickSizeOpenChange={actions.handleTickSizeOpenChange}
        onSelectTickSize={actions.handleSelectTickSize}
      />

      <TableColumnsHeader quoteAsset={quoteAsset} baseAsset={baseAsset} />

      <TableRows
        rows={data.visibleAsks}
        side="ask"
        reservedRowCount={state.bookMode === "buy" ? 0 : rowCount}
        baseAsset={baseAsset}
        quoteAsset={quoteAsset}
        hoveredRow={state.hoveredRow}
        showOverlayStats={state.showOverlayStats}
        roundingEnabled={state.roundingEnabled}
        animationsEnabled={state.animationsEnabled}
        isRowFlashing={data.isRowFlashing}
        onHoverStart={actions.handleAskHoverStart}
        onHoverEnd={actions.handleAskHoverEnd}
        getOverlay={data.getOverlay}
        getRowHighlightState={data.getRowHighlightState}
      />

      <TableMidPrice
        centerPrice={data.centerPrice}
        centerConvertedPrice={data.centerConvertedPrice}
        centerPriceDirection={data.centerPriceDirection}
      />

      <TableRows
        rows={data.visibleBids}
        side="bid"
        reservedRowCount={state.bookMode === "sell" ? 0 : rowCount}
        baseAsset={baseAsset}
        quoteAsset={quoteAsset}
        hoveredRow={state.hoveredRow}
        showOverlayStats={state.showOverlayStats}
        roundingEnabled={state.roundingEnabled}
        animationsEnabled={state.animationsEnabled}
        isRowFlashing={data.isRowFlashing}
        onHoverStart={actions.handleBidHoverStart}
        onHoverEnd={actions.handleBidHoverEnd}
        getOverlay={data.getOverlay}
        getRowHighlightState={data.getRowHighlightState}
      />

      <TableRatioSection
        showRatioBar={state.showRatioBar}
        bookMode={state.bookMode}
        buyRatio={data.buyRatio}
        sellRatio={data.sellRatio}
      />
    </section>
  );
}
