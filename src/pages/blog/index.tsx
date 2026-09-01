import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { PublicFooter, PublicHeader } from '../../components/PublicSiteChrome';
import { blogPosts } from '../../data/blogPosts';

export default function BlogIndexPage() {
  return (
    <div className="site-shell text-slate-900">
      <PublicHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/#product', label: 'Product' },
          { href: '/#about-us', label: 'About Us' },
          { href: '/blog', label: 'Blog' },
        ]}
        ctaPrimary={{ label: 'Open App', onClick: () => { window.location.href = '/dashboard'; } }}
      />

      <main>
        <section className="site-section">
          <div className="site-container">
            <div className="mx-auto max-w-4xl text-center">
              <span className="inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
                BrandPawa Blog
              </span>
              <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">Brand thinking that helps you move with clarity</h1>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Five core BrandPawa articles from {blogPosts[0]?.publishedBy}, built around positioning, visibility, revenue, and authority.
              </p>
            </div>

            <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {blogPosts.map((post) => (
                <article key={post.slug} className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
                  <img src={post.image} alt={post.title} className="h-56 w-full object-cover" />
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                      Published by {post.publishedBy}
                    </div>
                    <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900">{post.title}</h2>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      Read article
                      <FiArrowRight />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <PublicFooter
        tagline="Diagnosis before prescription, clarity before execution."
        links={[
          { href: '/', label: 'Home' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
          { href: '/blog', label: 'Blog' },
        ]}
      />
    </div>
  );
}
