import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Bugs board', end: true },
  { to: '/overview', label: 'Overview', end: false },
  { to: '/mindmap', label: 'Mind map', end: false },
] as const

export function SiteNav() {
  return (
    <nav
      aria-label="Site"
      className="flex flex-wrap items-center gap-1 font-[family-name:var(--font-mono)] text-[11px]"
    >
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          className={({ isActive }) =>
            [
              'rounded-sm px-2.5 py-1.5 tracking-wide no-underline transition-colors',
              isActive
                ? 'bg-[color-mix(in_srgb,var(--amber)_22%,transparent)] text-[var(--amber)]'
                : 'text-[var(--text-muted)] hover:bg-[color-mix(in_srgb,var(--border)_55%,transparent)] hover:text-[var(--text)]',
            ].join(' ')
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  )
}
