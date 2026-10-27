import { useEffect, useId, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const topLinks = [
  { to: '/', label: 'Bugs board', end: true },
  { to: '/overview', label: 'Overview', end: false },
  { to: '/mindmap', label: 'Mindmap', end: false },
] as const

const testingLinks = [
  { to: '/strategy', label: 'Test Strategy' },
  { to: '/plan', label: 'Test Plan' },
  { to: '/test-cases', label: 'Test Cases' },
] as const

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'rounded-sm px-3.5 py-2.5 text-[16px] font-semibold leading-none tracking-wide no-underline transition-colors sm:px-4 sm:text-[17px]',
    isActive
      ? 'bg-[var(--amber)] text-[#1a1204] shadow-[0_0_18px_color-mix(in_srgb,var(--amber)_45%,transparent)]'
      : 'text-[#d4e0f0] hover:bg-[color-mix(in_srgb,var(--amber)_18%,transparent)] hover:text-[var(--amber)]',
  ].join(' ')

function canHoverOpen(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches
}

export function SiteNav() {
  const location = useLocation()
  const menuId = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const [open, setOpen] = useState(false)

  const testingActive = testingLinks.some(
    (l) => location.pathname === l.to || location.pathname.startsWith(`${l.to}/`),
  )

  const clearCloseTimer = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = window.setTimeout(() => setOpen(false), 140)
  }

  useEffect(() => {
    setOpen(false)
    clearCloseTimer()
  }, [location.pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        wrapRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onPointer)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onPointer)
    }
  }, [open])

  useEffect(() => () => clearCloseTimer(), [])

  return (
    <nav
      aria-label="Site"
      className="flex max-w-full flex-wrap items-center justify-center gap-1.5 rounded-md border border-[color-mix(in_srgb,var(--amber)_35%,var(--border))] bg-[color-mix(in_srgb,var(--bg)_55%,transparent)] p-1.5 font-[family-name:var(--font-mono)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--amber)_12%,transparent)]"
    >
      {topLinks.map((link) => (
        <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
          {link.label}
        </NavLink>
      ))}

      <div
        ref={wrapRef}
        className="relative"
        onMouseEnter={() => {
          if (canHoverOpen()) openMenu()
        }}
        onMouseLeave={() => {
          if (canHoverOpen()) scheduleClose()
        }}
        onFocus={openMenu}
        onBlur={(e) => {
          if (!wrapRef.current?.contains(e.relatedTarget as Node)) scheduleClose()
        }}
      >
        <button
          type="button"
          id={`${menuId}-btn`}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={`${menuId}-menu`}
          onClick={() => {
            // Desktop hover already opens; click is for touch / keyboard toggle.
            if (canHoverOpen()) {
              openMenu()
              return
            }
            setOpen((v) => !v)
          }}
          className={[
            'inline-flex items-center gap-1.5 rounded-sm px-3.5 py-2.5 text-[16px] font-semibold leading-none tracking-wide transition-colors sm:px-4 sm:text-[17px]',
            testingActive || open
              ? 'bg-[var(--amber)] text-[#1a1204] shadow-[0_0_18px_color-mix(in_srgb,var(--amber)_45%,transparent)]'
              : 'text-[#d4e0f0] hover:bg-[color-mix(in_srgb,var(--amber)_18%,transparent)] hover:text-[var(--amber)]',
          ].join(' ')}
        >
          Testing
          <span aria-hidden className="text-[11px] opacity-80">
            {open ? '▴' : '▾'}
          </span>
        </button>
        {open ? (
          <div
            id={`${menuId}-menu`}
            role="menu"
            aria-labelledby={`${menuId}-btn`}
            className="absolute top-full left-1/2 z-40 min-w-[11.5rem] -translate-x-1/2 pt-1.5"
          >
            <div className="rounded-md border border-[color-mix(in_srgb,var(--amber)_35%,var(--border))] bg-[var(--bg-elevated)] p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
              {testingLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  role="menuitem"
                  className={({ isActive }) =>
                    [
                      'block rounded-sm px-3 py-2.5 text-[15px] font-semibold no-underline transition-colors',
                      isActive
                        ? 'bg-[var(--amber)] text-[#1a1204]'
                        : 'text-[#d4e0f0] hover:bg-[color-mix(in_srgb,var(--amber)_18%,transparent)] hover:text-[var(--amber)]',
                    ].join(' ')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  )
}
