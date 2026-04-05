import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonWrapperProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "type" | "children"
> & {
  children: ReactNode;
};

export type ActivatableButtonProps = ButtonWrapperProps & {
  isActive: boolean;
};
