import { clsx } from "clsx";
import { ArrowDownIcon, ChevronRightIcon } from "@/components/Icon";

type TableMidPriceProps = {
  centerPrice: string;
  centerConvertedPrice: string;
  centerPriceDirection: "up" | "down";
};

export function TableMidPrice({
  centerPrice,
  centerConvertedPrice,
  centerPriceDirection,
}: TableMidPriceProps) {
  const isUp = centerPriceDirection === "up";
  const toneClass = isUp ? "text-(--buy-color)" : "text-(--sell-color)";
  const compactMetaClassName =
    "ob-compact-meta ob-text-tertiary ml-1 flex flex-1 text-left";

  return (
    <div className="flex h-[36px] items-center overflow-hidden px-4">
      <div className="flex min-w-0 items-center">
        <span
          className={clsx(
            "mt-[-2px] text-[20px] leading-[20px] font-medium",
            toneClass,
          )}
        >
          {centerPrice}
        </span>
        <span className={clsx(toneClass, isUp && "rotate-180 transform")}>
          <ArrowDownIcon />
        </span>
      </div>
      <div className={compactMetaClassName}>
        <span>$</span>
        <span>{centerConvertedPrice.replace(/^\$/, "")}</span>
      </div>
      <span className="ob-icon-normal flex transition-colors hover:text-(--text-primary)">
        <ChevronRightIcon />
      </span>
    </div>
  );
}
