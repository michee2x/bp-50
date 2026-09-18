import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import {
  LogInIcon,
  UserIcon,
  LogOutIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  LayoutDashboardIcon,
  ArrowRightIcon,
} from 'lucide-react';
import { BrandPawaLogo } from './BrandPawaLogo';

type NavLink = {
  href: string;
  label: string;
  items?: NavLink[];
};

type PublicHeaderProps = {
  links: NavLink[];
  sessionUser?: any;
  ctaPrimary?: {
    label: string;
    onClick: () => void;
  };
  ctaSecondary?: {
    label: string;
    onClick: () => void;
  };
  onLoginClick?: () => void;
  onLogout?: () => void;
};

type PublicFooterProps = {
  tagline: string;
  links?: NavLink[];
  contactLabel?: string;
  contactHref?: string;
  note?: string;
  badges?: string[];
};

// ─── Dropdown wrapper with hover logic ───────────────────────────────────────
function NavDropdown({ link }: { link: NavLink }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="site-nav-group relative">
      <button
        type="button"
        className="site-nav-link inline-flex items-center gap-1"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        {link.label}
        <ChevronDownIcon
          size={13}
          className={`transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className="site-nav-dropdown"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transform: open ? 'translateY(0)' : 'translateY(6px)' }}
      >
        {link.items!.map((item) => (
          <Link key={item.href} href={item.href} className="site-nav-dropdown-link">
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── User dropdown (authenticated) ───────────────────────────────────────────
function UserDropdown({ onLogout }: { onLogout?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="nav-icon-btn"
        aria-label="Account menu"
      >
        <UserIcon size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-50 min-w-[13rem] rounded-xl border border-slate-200 bg-white shadow-xl p-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen(false)}
          >
            <LayoutDashboardIcon size={14} />
            Dashboard
          </Link>
          <hr className="my-1 border-slate-100" />
          <button
            type="button"
            onClick={() => { setOpen(false); onLogout?.(); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOutIcon size={14} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Mobile drawer ────────────────────────────────────────────────────────────
function MobileDrawer({
  open,
  onClose,
  links,
  sessionUser,
  ctaPrimary,
  onLoginClick,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  sessionUser?: any;
  ctaPrimary?: PublicHeaderProps['ctaPrimary'];
  onLoginClick?: () => void;
  onLogout?: () => void;
}) {
  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(80vw,20rem)] bg-white shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <BrandPawaLogo href="/" size="sm" />
          <button
            type="button"
            onClick={onClose}
            className="nav-icon-btn"
            aria-label="Close menu"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1">
          {links.map((link) =>
            link.items?.length ? (
              <div key={link.label}>
                <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-400">
                  {link.label}
                </p>
                {link.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                onClick={onClose}
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Bottom auth area */}
        <div className="border-t border-slate-100 px-4 py-5 space-y-2">
          {sessionUser ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
                onClick={onClose}
              >
                <LayoutDashboardIcon size={15} />
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => { onClose(); onLogout?.(); }}
                className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 transition"
              >
                <LogOutIcon size={15} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => { onClose(); onLoginClick?.(); }}
                className="flex items-center justify-center gap-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                <LogInIcon size={15} />
                Login
              </button>
              {ctaPrimary && (
                <button
                  type="button"
                  onClick={() => { onClose(); ctaPrimary.onClick(); }}
                  className="site-primary-button w-full justify-center"
                >
                  {ctaPrimary.label}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Public Header ────────────────────────────────────────────────────────────
export function PublicHeader({
  links,
  sessionUser,
  ctaPrimary,
  ctaSecondary,
  onLoginClick,
  onLogout,
}: PublicHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="site-nav">
        <div className="site-container">
          <div className="flex h-14 items-center gap-4">

            {/* Logo */}
            <div className="flex-shrink-0">
              <BrandPawaLogo priority size="sm" />
            </div>

            {/* Desktop nav links */}
            <div className="hidden lg:flex flex-1 items-center gap-1 ml-3">
              {links.map((link) =>
                link.items?.length ? (
                  <NavDropdown key={link.label} link={link} />
                ) : (
                  <Link key={link.href} href={link.href} className="site-nav-link">
                    {link.label}
                  </Link>
                )
              )}
            </div>

            {/* Right-side actions */}
            <div className="flex items-center gap-2 ml-auto">
              {sessionUser ? (
                /* Authenticated: clean text links */
                <>
                  <Link
                    href="/dashboard"
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    <LayoutDashboardIcon size={14} />
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-red-600 transition"
                  >
                    <LogOutIcon size={14} />
                    Logout
                  </button>
                </>
              ) : (
                /* Guest: Login + CTA */
                <>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    <LogInIcon size={15} />
                    Login
                  </button>

                  {ctaPrimary && (
                    <button
                      type="button"
                      onClick={ctaPrimary.onClick}
                      className="site-primary-button text-sm px-4 py-2 min-h-0 h-9 whitespace-nowrap shrink-0"
                    >
                      {ctaPrimary.label}
                    </button>
                  )}
                </>
              )}

              {/* Mobile hamburger — far right, only on mobile */}
              <button
                type="button"
                className="nav-icon-btn lg:hidden shrink-0"
                aria-label="Open menu"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon size={18} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile drawer (outside header so it can be full-height) */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={links}
        sessionUser={sessionUser}
        ctaPrimary={ctaPrimary}
        onLoginClick={onLoginClick}
        onLogout={onLogout}
      />
    </>
  );
}

// ─── Public Footer ────────────────────────────────────────────────────────────
export function PublicFooter({
  tagline,
  links = [],
  contactLabel,
  contactHref,
  note,
  badges = [],
}: PublicFooterProps) {
  return (
    <footer className="mt-16 bg-slate-950 text-white">
      <div className="site-container py-10">
        <div className="flex flex-col gap-8 border-b border-white/10 pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <BrandPawaLogo href="/" size="md" className="mb-4" />
            <p className="text-sm leading-6 text-slate-300">{tagline}</p>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
            {contactLabel && contactHref && (
              <Link href={contactHref} className="inline-flex items-center gap-2 font-medium text-white">
                {contactLabel}
                <ArrowRightIcon size={14} />
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-400">
            <p>© {new Date().getFullYear()} BrandPawa. All rights reserved.</p>
            {note && <p className="mt-1">{note}</p>}
          </div>

          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
