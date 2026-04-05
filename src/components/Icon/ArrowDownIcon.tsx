import { iconSizeClasses } from "@components/Icon/internal/classes";
import { SvgIcon } from "@components/Icon/internal/SvgIcon";

export function ArrowDownIcon() {
  return (
    <SvgIcon className={iconSizeClasses.md}>
      <path
        d="M11.1 4v13.826l-4.463-4.463a.9.9 0 00-1.274 1.274l6 6 .069.061a.9.9 0 001.205-.061l6-6 .061-.069a.9.9 0 00-1.266-1.266l-.069.061-4.463 4.463V4a.9.9 0 00-1.8 0z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
