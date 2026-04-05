import {
  buttonAlignClasses,
  buttonSizeClasses,
  buttonVariantClasses,
} from "@components/Button/internal/classes";
import type {
  ButtonAlign,
  ButtonSize,
  ButtonVariant,
} from "@components/Button/types";
import { clsx } from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { forwardRef } from "react";

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & {
  children: ReactNode;
  size: ButtonSize;
  variant?: ButtonVariant;
  align?: ButtonAlign;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { children, size, variant, align = "left", className, ...buttonProps },
    ref,
  ) {
    const classes = clsx(
      buttonSizeClasses[size],
      variant ? buttonVariantClasses[variant] : "",
      buttonAlignClasses[align],
      className,
    );

    return (
      <button ref={ref} type="button" className={classes} {...buttonProps}>
        {children}
      </button>
    );
  },
);
