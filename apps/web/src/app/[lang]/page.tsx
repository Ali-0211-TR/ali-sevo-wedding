import { getPublicPage, getPublicEvents } from '@/lib/api';
import { type Lang } from '@/i18n/translations';
import BlockRenderer from '@/components/BlockRenderer';

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [page, events] = await Promise.all([getPublicPage('home'), getPublicEvents()]);

  const blocks = page?.blocks || [];

  return (
    <div>
      <BlockRenderer blocks={blocks} lang={lang as Lang} events={events || []} />
    </div>
  );
}
