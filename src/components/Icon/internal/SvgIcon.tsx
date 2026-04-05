import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SvgIconProps = Omit<ComponentPropsWithoutRef<"svg">, "children"> & {
  children: ReactNode;
};

export function SvgIcon({ children, ...svgProps }: SvgIconProps) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      {...svgProps}
    >
      {children}
    </svg>
  );
}
