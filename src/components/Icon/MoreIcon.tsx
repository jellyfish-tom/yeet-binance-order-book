import { iconSizeClasses } from "@components/Icon/internal/classes";
import { SvgIcon } from "@components/Icon/internal/SvgIcon";

export function MoreIcon() {
  return (
    <SvgIcon className={iconSizeClasses.md}>
      <path
        d="M4.9 10a1.5 1.5 0 011.5 1.5v1A1.5 1.5 0 014.9 14h-1a1.5 1.5 0 01-1.5-1.5v-1A1.5 1.5 0 013.9 10h1zm7.6 0a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5h1zm7.6 0a1.5 1.5 0 011.5 1.5v1a1.5 1.5 0 01-1.5 1.5h-1a1.5 1.5 0 01-1.5-1.5v-1a1.5 1.5 0 011.5-1.5h1z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
