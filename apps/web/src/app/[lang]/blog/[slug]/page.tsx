import { getPublicBlogPost } from '@/lib/api';
import { t, type Lang } from '@/i18n/translations';
import { notFound } from 'next/navigation';
import dayjs from 'dayjs';

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  const post = await getPublicBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="article">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={t(post.title, lang)}
          className="article-cover"
        />
      )}
      <p className="article-meta">
        {post.publishedAt && dayjs(post.publishedAt).format('D MMMM YYYY')}
      </p>
      <h1>{t(post.title, lang)}</h1>
      <div
        className="article-content"
        dangerouslySetInnerHTML={{ __html: t(post.content, lang) }}
      />
    </article>
  );
}
