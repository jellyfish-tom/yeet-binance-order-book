import type { ToggleSwitchSize } from "@components/ToggleSwitch/types";

export const toggleSwitchSizeClasses: Record<
  ToggleSwitchSize,
  {
    track: string;
    thumb: string;
    thumbOn: string;
  }
> = {
  xxs: {
    track: "h-[16px] w-[28px] rounded-[8px]",
    thumb: "left-[1px] top-[1px] h-[14px] w-[14px] rounded-[7px]",
    thumbOn: "translate-x-[12px]",
  },
  xs: {
    track: "h-[18px] w-[32px] rounded-[9px]",
    thumb: "left-[1px] top-[1px] h-[16px] w-[16px] rounded-[8px]",
    thumbOn: "translate-x-[14px]",
  },
  sm: {
    track: "h-[20px] w-[36px] rounded-[10px]",
    thumb: "left-[1px] top-[1px] h-[18px] w-[18px] rounded-[9px]",
    thumbOn: "translate-x-[16px]",
  },
  md: {
    track: "h-[24px] w-[44px] rounded-[12px]",
    thumb: "left-[2px] top-[2px] h-[20px] w-[20px] rounded-[10px]",
    thumbOn: "translate-x-[20px]",
  },
  lg: {
    track: "h-[28px] w-[52px] rounded-[14px]",
    thumb: "left-[2px] top-[2px] h-[24px] w-[24px] rounded-[12px]",
    thumbOn: "translate-x-[24px]",
  },
};
