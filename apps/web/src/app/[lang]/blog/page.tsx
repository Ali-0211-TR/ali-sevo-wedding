import { getPublicBlogPosts } from '@/lib/api';
import { t, i18n, type Lang } from '@/i18n/translations';
import Link from 'next/link';
import dayjs from 'dayjs';

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const posts = (await getPublicBlogPosts()) || [];

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">{i18n('nav.blog', lang)}</h1>
        {posts.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            No posts yet.
          </p>
        ) : (
          <div className="blog-grid">
            {posts.map((post: any) => (
              <Link
                key={post.id}
                href={`/${lang}/blog/${post.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <article className="blog-card">
                  {post.coverImage && (
                    <img
                      src={post.coverImage}
                      alt={t(post.title, lang)}
                      className="blog-card-image"
                    />
                  )}
                  <div className="blog-card-body">
                    {post.publishedAt && (
                      <p className="blog-card-date">
                        {dayjs(post.publishedAt).format('D MMMM YYYY')}
                      </p>
                    )}
                    <h3>{t(post.title, lang)}</h3>
                    {post.excerpt && (
                      <p>{t(post.excerpt, lang)}</p>
                    )}
                    <span className="read-more">
                      {i18n('blog.readMore', lang)} →
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
