import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Arc Browser Split Pattern */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left: Logo + tagline */}
          <div className="flex flex-col gap-2">
            <Link href="/">
              <img
                src="https://www.brandpawa.com/_next/image?url=%2Fimages%2FBrandPawa%20logo2.png&w=384&q=75"
                alt="BrandPawa logo"
                width={120}
                height={30}
                className="h-7 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
            </Link>
            <p className="text-xs font-medium text-muted-foreground tracking-wide">
              The #1 Brand Operating System
            </p>
          </div>

          {/* Right: Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            <Link href="/privacy" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="/gdpr" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              GDPR
            </Link>
            <a
              href="https://t.me/BrandPawa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </a>
            <Link href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>
        </div>

        {/* Bottom row */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs font-medium text-muted-foreground">
            © 2026 BrandPawa. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Telegram */}
            <a
              href="https://t.me/BrandPawa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BrandPawa Telegram"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8l-1.7 8.02c-.12.57-.46.71-.94.44l-2.6-1.92-1.25 1.21c-.14.14-.26.26-.53.26l.19-2.67 4.84-4.37c.21-.19-.05-.29-.32-.1L7.96 14.5l-2.55-.8c-.55-.17-.56-.55.12-.82l9.97-3.84c.46-.17.86.11.14.76z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://web.facebook.com/groups/brandpawa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BrandPawa Facebook"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://chat.whatsapp.com/JFhzaTnEjOD9vUan4KbCzx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="BrandPawa WhatsApp"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
