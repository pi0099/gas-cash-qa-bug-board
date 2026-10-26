import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Bugs board', end: true },
  { to: '/overview', label: 'Overview', end: false },
  { to: '/mindmap', label: 'Mind map', end: false },
  { to: '/test-cases', label: 'TC sheet', end: false },
  { to: '/claim-gps', label: 'Claim / GPS', end: false },
] as const

export function SiteNav() {
  return (
    <nav
      aria-label="Site"
      className="flex flex-wrap items-center justify-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--amber)_35%,var(--border))] bg-[color-mix(in_srgb,var(--bg)_55%,transparent)] p-1.5 font-[family-name:var(--font-mono)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--amber)_12%,transparent)]"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            [
              'rounded-sm px-4 py-2.5 text-[18px] font-semibold leading-none tracking-wide no-underline transition-colors sm:px-5 sm:text-[19px]',
              isActive
                ? 'bg-[var(--amber)] text-[#1a1204] shadow-[0_0_18px_color-mix(in_srgb,var(--amber)_45%,transparent)]'
                : 'text-[#d4e0f0] hover:bg-[color-mix(in_srgb,var(--amber)_18%,transparent)] hover:text-[var(--amber)]',
            ].join(' ')
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
