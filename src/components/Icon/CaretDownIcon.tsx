import { iconSizeClasses } from "@components/Icon/internal/classes";
import { SvgIcon } from "@components/Icon/internal/SvgIcon";

export function CaretDownIcon() {
  return (
    <SvgIcon className={iconSizeClasses.md}>
      <path
        d="M16.37 8.75H7.63a.75.75 0 00-.569 1.238l4.37 5.098c.299.349.84.349 1.138 0l4.37-5.098a.75.75 0 00-.57-1.238z"
        fill="currentColor"
      />
    </SvgIcon>
  );
}
