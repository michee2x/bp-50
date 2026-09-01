import type { GetStaticPaths, GetStaticProps } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { PublicFooter, PublicHeader } from '../../components/PublicSiteChrome';
import { blogPosts, type BlogPost, getBlogPostBySlug } from '../../data/blogPosts';

type BlogPostPageProps = {
  post: BlogPost;
};

export default function BlogPostPage({ post }: BlogPostPageProps) {
  const relatedPosts = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <div className="site-shell text-slate-900">
      <PublicHeader
        links={[
          { href: '/', label: 'Home' },
          { href: '/blog', label: 'Blog' },
          { href: '/#product', label: 'Product' },
        ]}
        ctaPrimary={{ label: 'Open App', onClick: () => { window.location.href = '/dashboard'; } }}
      />

      <main>
        <section className="site-section">
          <div className="site-container">
            <div className="mx-auto max-w-5xl">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-purple-800">
                <FiArrowLeft />
                Back to Blog
              </Link>

              <div className="mt-6 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
                <img src={post.image} alt={post.title} className="h-72 w-full object-cover sm:h-[28rem]" />
                <div className="p-6 sm:p-10">
                  <div className="inline-flex rounded-full bg-purple-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
                    Published by {post.publishedBy}
                  </div>
                  <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900 sm:text-5xl">{post.title}</h1>
                  <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>
                  <div className="mt-8 grid gap-4 rounded-[24px] bg-slate-50 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="font-semibold text-slate-900">{post.publishedBy}</div>
                      <div className="mt-1 text-sm text-slate-600">{post.role}</div>
                    </div>
                    <a
                      href={post.imageAttributionHref}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-purple-700 transition hover:text-purple-800"
                    >
                      {post.imageAttributionLabel}
                      <FiArrowRight />
                    </a>
                  </div>
                </div>
              </div>

              <article className="mx-auto mt-10 max-w-4xl space-y-10">
                {post.sections.map((section) => (
                  <section key={section.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
                    <div className="mt-5 space-y-5 text-base leading-8 text-slate-700">
                      {section.paragraphs.map((paragraph, index) => (
                        <p key={`${section.title}-${index}`}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}
              </article>

              <section className="mx-auto mt-12 max-w-6xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">Keep Reading</div>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">Other blog posts you should read next</h2>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      Keep the momentum going with more BrandPawa thinking on clarity, visibility, authority, and revenue.
                    </p>
                  </div>
                  <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-purple-800">
                    View all posts
                    <FiArrowRight />
                  </Link>
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-3">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="overflow-hidden rounded-[24px] border border-slate-200 bg-slate-50 transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <img src={relatedPost.image} alt={relatedPost.title} className="h-44 w-full object-cover" />
                      <div className="p-5">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-700">
                          Published by {relatedPost.publishedBy}
                        </div>
                        <h3 className="mt-3 text-lg font-bold leading-tight text-slate-900">{relatedPost.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-slate-600">{relatedPost.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter
        tagline="Brand clarity, visibility, authority, and revenue thinking in one operating system."
        links={[
          { href: '/', label: 'Home' },
          { href: '/blog', label: 'Blog' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/terms', label: 'Terms' },
        ]}
      />
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: blogPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({ params }) => {
  const slug = params?.slug;
  const post = typeof slug === 'string' ? getBlogPostBySlug(slug) : null;

  if (!post) {
    return { notFound: true };
  }

  return {
    props: {
      post,
    },
  };
};
