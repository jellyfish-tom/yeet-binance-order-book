import type { OverlayData } from "@pages/OrderBook/components/Table/hooks";

type TableRowOverlayProps = {
  overlay?: OverlayData;
  baseAsset: string;
  quoteAsset: string;
};

export function TableRowOverlay({
  overlay,
  baseAsset,
  quoteAsset,
}: TableRowOverlayProps) {
  if (!overlay) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute left-full top-1/2 z-30 ml-1"
      style={{ transform: "translateY(-50%)" }}
    >
      <div className="relative flex items-center">
        <div className="h-0 w-0 shrink-0 border-b-[5px] border-b-transparent border-r-[5px] border-r-[var(--color-PrimaryText)] border-t-[5px] border-t-transparent opacity-95" />
        <div className="ob-overlay-card">
          <div className="ob-overlay-row">
            <div className="mr-2">Avg.Price:</div>
            <div>{overlay.avgPrice}</div>
          </div>
          <div className="ob-overlay-row">
            <div className="mr-2">Sum {baseAsset}:</div>
            <div>{overlay.sumAmount}</div>
          </div>
          <div className="ob-overlay-row">
            <div className="mr-2">Sum {quoteAsset}:</div>
            <div>{overlay.sumTotal}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
