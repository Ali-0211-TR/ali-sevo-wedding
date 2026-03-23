import { getPublicPage } from '@/lib/api';
import { type Lang } from '@/i18n/translations';
import BlockRenderer from '@/components/BlockRenderer';
import { notFound } from 'next/navigation';

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ lang: string; pageSlug: string }>;
}) {
  const { lang, pageSlug } = await params;
  const page = await getPublicPage(pageSlug);

  if (!page) {
    notFound();
  }

  return (
    <div>
      <BlockRenderer blocks={page.blocks || []} lang={lang as Lang} events={[]} />
    </div>
  );
}
