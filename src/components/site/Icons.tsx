import React from 'react'

/**
 * The design's own icon set, inlined. Every glyph is 24×24 on a 2.75 stroke —
 * heavier than most icon fonts, which is what lets them hold up next to
 * Playfair Display at display sizes.
 */
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: 2.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

type IconProps = { size?: number; stroke?: string; className?: string }

export const PhoneIcon = ({ size = 22, stroke = 'var(--color-accent)', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
  </svg>
)

export const MailIcon = ({ size = 22, stroke = 'var(--color-accent)', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <path d="m3 7 9 6 9-6" />
  </svg>
)

export const InstagramIcon = ({ size = 20, stroke = 'currentColor', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
)

export const FacebookIcon = ({ size = 20, stroke = 'currentColor', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <path d="M15 3h-2.5A4.5 4.5 0 0 0 8 7.5V10H5.5v4H8v7h4v-7h3l1-4h-4V7.5A1.5 1.5 0 0 1 13.5 6H16V3Z" />
  </svg>
)

export const GlobeIcon = ({ size = 20, stroke = 'currentColor', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 9h17M3.5 15h17M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
  </svg>
)

export const YouTubeIcon = ({ size = 20, stroke = 'currentColor', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <path d="m11 9.5 4 2.5-4 2.5Z" />
  </svg>
)

export const CalendarIcon = ({ size = 15, stroke = 'var(--color-accent)', className }: IconProps) => (
  <svg {...base} width={size} height={size} stroke={stroke} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="3" />
    <path d="M8 3v4M16 3v4M3 11h18" />
  </svg>
)

export const SOCIAL_ICONS: Record<string, React.FC<IconProps>> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  youtube: YouTubeIcon,
  website: GlobeIcon,
}
