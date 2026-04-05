import { PillButton } from "@components/Button";
import type {
  MarketSymbol,
  OrderBookMarketConfig,
} from "@pages/OrderBook/model/markets";
import { isMarketSymbol } from "@pages/OrderBook/model/markets";
import { clsx } from "clsx";

type ControlsProps = {
  markets: readonly OrderBookMarketConfig[];
  activeMarketSymbol: MarketSymbol;
  onSelectMarket: (symbol: MarketSymbol) => void;
};

export function Controls({
  markets,
  activeMarketSymbol,
  onSelectMarket,
}: ControlsProps) {
  return (
    <div className="ob-panel-card p-4 backdrop-blur">
      <div className="flex flex-wrap gap-2">
        {markets.map((market) => {
          const isActive = market.symbol === activeMarketSymbol;

          return (
            <PillButton
              key={market.symbol}
              isActive={isActive}
              onClick={() =>
                onSelectMarket(
                  isMarketSymbol(market.symbol)
                    ? market.symbol
                    : activeMarketSymbol,
                )
              }
              className={clsx(
                isActive
                  ? "border-(--color-YellowAlpha02) bg-(--color-YellowAlpha01) text-(--text-primary) shadow-[0_0_0_1px_rgba(240,185,11,0.08)]"
                  : "border-(--color-LineAlpha) bg-(--panel-bg-deep) text-(--text-secondary) hover:border-(--color-InputLine) hover:text-(--text-primary)",
              )}
            >
              {market.label}
            </PillButton>
          );
        })}
      </div>
    </div>
  );
}
