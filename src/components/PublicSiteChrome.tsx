import Link from 'next/link';
import { useState } from 'react';
import { FiArrowRight, FiChevronDown, FiMenu, FiX } from 'react-icons/fi';
import { BrandPawaLogo } from './BrandPawaLogo';

type NavLink = {
  href: string;
  label: string;
  items?: NavLink[];
};

type PublicHeaderProps = {
  links: NavLink[];
  ctaPrimary?: {
    label: string;
    onClick: () => void;
  };
  ctaSecondary?: {
    label: string;
    onClick: () => void;
  };
};

type PublicFooterProps = {
  tagline: string;
  links?: NavLink[];
  contactLabel?: string;
  contactHref?: string;
  note?: string;
  badges?: string[];
};

export function PublicHeader({
  links,
  ctaPrimary,
  ctaSecondary,
}: PublicHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="site-nav">
      <div className="site-container">
        <div className="site-nav-row">
          <div className="site-nav-brand">
            <BrandPawaLogo priority size="md" />
          </div>

          <div className="site-nav-desktop hidden lg:flex">
            <div className="site-nav-links-shell">
              {links.map((link) => (
                link.items?.length ? (
                  <div key={link.label} className="site-nav-group">
                    <button type="button" className="site-nav-link inline-flex items-center gap-1">
                      {link.label}
                      <FiChevronDown size={14} />
                    </button>
                    <div className="site-nav-dropdown">
                      {link.items.map((item) => (
                        <Link key={item.href} href={item.href} className="site-nav-dropdown-link">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.href} href={link.href} className="site-nav-link">
                    {link.label}
                  </Link>
                )
              ))}
            </div>

            <div className="site-nav-actions">
              {ctaSecondary && (
                <button onClick={ctaSecondary.onClick} className="site-ghost-button" type="button">
                  {ctaSecondary.label}
                </button>
              )}

              {ctaPrimary && (
                <button onClick={ctaPrimary.onClick} className="site-primary-button" type="button">
                  {ctaPrimary.label}
                </button>
              )}
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg border border-white/35 bg-white/45 p-2.5 text-slate-700 shadow-sm backdrop-blur-md lg:hidden"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="space-y-3 border-t border-slate-200 pb-4 pt-4 lg:hidden">
            {links.map((link) => (
              link.items?.length ? (
                <div key={link.label} className="rounded-xl border border-slate-200 p-3">
                  <div className="px-1 text-sm font-semibold text-slate-900">{link.label}</div>
                  <div className="mt-2 space-y-1">
                    {link.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block rounded-xl px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-xl px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}

            {(ctaSecondary || ctaPrimary) && (
              <div className="space-y-3 pt-3">
                {ctaSecondary && (
                  <button
                    type="button"
                    className="site-ghost-button w-full justify-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      ctaSecondary.onClick();
                    }}
                  >
                    {ctaSecondary.label}
                  </button>
                )}
                {ctaPrimary && (
                  <button
                    type="button"
                    className="site-primary-button w-full justify-center"
                    onClick={() => {
                      setIsMenuOpen(false);
                      ctaPrimary.onClick();
                    }}
                  >
                    {ctaPrimary.label}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

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
                <FiArrowRight size={14} />
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
