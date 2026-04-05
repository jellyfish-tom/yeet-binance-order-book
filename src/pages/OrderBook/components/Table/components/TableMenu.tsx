import { Popover } from "@components/Popover";
import { ToggleSwitch } from "@components/ToggleSwitch";
import {
  DepthModeButton,
  ToggleMenuButton,
} from "@pages/OrderBook/components/Table/components";
import type { DepthMode } from "@pages/OrderBook/components/Table/hooks";

type TableMenuProps = {
  showOverlayStats: boolean;
  showRatioBar: boolean;
  roundingEnabled: boolean;
  depthMode: DepthMode;
  animationsEnabled: boolean;
  onToggleOverlayStats: () => void;
  onToggleRatioBar: () => void;
  onToggleRounding: () => void;
  onSetDepthModeAmount: () => void;
  onSetDepthModeCumulative: () => void;
  onToggleAnimations: () => void;
};

export function TableMenu({
  showOverlayStats,
  showRatioBar,
  roundingEnabled,
  depthMode,
  animationsEnabled,
  onToggleOverlayStats,
  onToggleRatioBar,
  onToggleRounding,
  onSetDepthModeAmount,
  onSetDepthModeCumulative,
  onToggleAnimations,
}: TableMenuProps) {
  return (
    <Popover.Portal>
      <Popover.Content
        side="bottom"
        align="end"
        sideOffset={4}
        className="ob-floating-panel w-[220px] pt-1"
      >
        <div className="ob-section-label">Order Book Display</div>

        <div className="ob-section-divider">
          <ToggleMenuButton
            isActive={showOverlayStats}
            label="Display Avg.&Sum"
            onClick={onToggleOverlayStats}
          />
          <ToggleMenuButton
            isActive={showRatioBar}
            label="Show Buy/Sell Ratio"
            onClick={onToggleRatioBar}
          />
          <ToggleMenuButton
            isActive={roundingEnabled}
            label="Rounding"
            onClick={onToggleRounding}
          />
        </div>

        <div className="pt-1">
          <div className="ob-section-label">Book Depth Visualization</div>

          <div className="ob-text-body-md ob-text-primary ob-section-divider pb-1">
            <DepthModeButton
              isActive={depthMode === "amount"}
              label="Amount"
              onClick={onSetDepthModeAmount}
            />
            <DepthModeButton
              isActive={depthMode === "cumulative"}
              label="Cumulative"
              onClick={onSetDepthModeCumulative}
            />
          </div>

          <div className="ob-text-action-sm ob-text-primary flex items-center justify-between px-3 py-3">
            <span>Animations</span>
            <ToggleSwitch
              isActive={animationsEnabled}
              onToggle={onToggleAnimations}
              aria-label="Toggle animations"
              size="sm"
            />
          </div>
        </div>
      </Popover.Content>
    </Popover.Portal>
  );
}
