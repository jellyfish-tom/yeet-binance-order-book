import { Tooltip } from "@components/Tooltip";
import type { BookMode } from "@pages/OrderBook/components/Table/hooks";

type TableRatioSectionProps = {
  showRatioBar: boolean;
  bookMode: BookMode;
  buyRatio: number;
  sellRatio: number;
};

export function TableRatioSection({
  showRatioBar,
  bookMode,
  buyRatio,
  sellRatio,
}: TableRatioSectionProps) {
  const shouldHideRatioBar = !showRatioBar || bookMode !== "default";
  const ratioRowClassName =
    "ob-compact-meta ob-text-primary flex h-[16px] items-center px-4 tabular-nums";

  if (shouldHideRatioBar) {
    return null;
  }

  return (
    <div className="pb-[10px] pt-[10px]">
      <div className={ratioRowClassName}>
        <div className="ob-inline-stat">
          <span>B</span>
          <span className="ml-[2px] text-(--buy-color)">{buyRatio}%</span>
        </div>

        <Tooltip
          isMultiline
          className="flex-1"
          label="Track the contents of the first 20 data tranches of the Spot Order book and update the data in real time."
        >
          <div className="flex flex-1 items-center px-2">
            <div
              className="mr-[2px] h-[4px] rounded-l-[2px] bg-(--buy-color)"
              style={{ width: `${buyRatio}%` }}
            />
            <div
              className="h-[4px] rounded-r-[2px] bg-(--sell-color)"
              style={{ width: `${sellRatio}%` }}
            />
          </div>
        </Tooltip>

        <div className="ob-inline-stat">
          <span className="mr-[2px] text-(--sell-color)">{sellRatio}%</span>
          <span>S</span>
        </div>
      </div>
    </div>
  );
}
