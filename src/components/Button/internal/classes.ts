import type {
  ButtonAlign,
  ButtonSize,
  ButtonVariant,
} from "@components/Button/types";

export const buttonSizeClasses: Record<ButtonSize, string> = {
  xxs: "h-4 min-w-4 px-0 py-0",
  xs: "h-6 min-w-[32px] px-2 py-0",
  sm: "h-[32px] min-w-[32px] px-3 py-0",
  md: "h-[36px] min-w-[36px] px-4 py-0",
  lg: "h-[40px] min-w-[40px] px-4 py-0",
};

export const buttonVariantClasses: Record<ButtonVariant, string> = {
  ghost: "transition-colors",
  subtle: "hover:bg-(--color-Input)",
  subtleAccent: "hover:bg-(--color-Input) hover:text-(--text-primary)",
};

export const buttonAlignClasses: Record<ButtonAlign, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};
