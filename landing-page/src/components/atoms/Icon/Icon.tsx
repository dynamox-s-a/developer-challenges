import styles from './Icon.module.scss'
import type { IconProps } from './Icon.types'

export function Icon({
  icon: IconSvg,
  size = 32,
  ariaLabel,
  className,
  padding = 0,
}: IconProps & { padding?: number }) {
  return (
    <span
      className={`${styles.icon} ${className}`}
      style={{ width: size, height: size, padding }}
      aria-label={ariaLabel}
      role={ariaLabel ? 'img' : undefined}
    >
      {IconSvg && (
        <IconSvg
          width="100%"
          height="100%"
          aria-hidden={!ariaLabel}
        />
      )}
    </span>
  );
}

export default Icon