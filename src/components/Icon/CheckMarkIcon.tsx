import { iconSizeClasses } from "@components/Icon/internal/classes";
import { SvgIcon } from "@components/Icon/internal/SvgIcon";

export function CheckMarkIcon() {
  return (
    <SvgIcon fill="currentColor" className={iconSizeClasses.sm}>
      <path
        d="M19.105 5.872a.9.9 0 011.29 1.256l-10.709 11a.9.9 0 01-1.295-.005l-4.79-5a.9.9 0 011.298-1.246l4.147 4.327 10.06-10.332z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
