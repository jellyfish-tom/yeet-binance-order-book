import { iconSizeClasses } from "@components/Icon/internal/classes";
import { SvgIcon } from "@components/Icon/internal/SvgIcon";

export function ChevronRightIcon() {
  return (
    <SvgIcon className={iconSizeClasses.md}>
      <path
        d="M15.698 12.568a.9.9 0 00-.061-1.205l-6-6-.069-.061a.9.9 0 00-1.266 1.266l.061.069L13.727 12l-5.364 5.363a.9.9 0 001.274 1.274l6-6 .061-.069z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
