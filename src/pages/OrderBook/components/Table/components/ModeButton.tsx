import { IconButton } from "@components/Button";
import { Tooltip } from "@components/Tooltip";
import type { ReactNode } from "react";

type ModeButtonProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
};

export function ModeButton({
  label,
  isActive,
  onClick,
  children,
}: ModeButtonProps) {
  return (
    <Tooltip label={label}>
      <IconButton
        aria-label={`${label} order book mode`}
        onClick={onClick}
        isActive={isActive}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
}
