import { getInvitationBySlug } from '@/lib/api';
import { type Lang } from '@/i18n/translations';
import { notFound } from 'next/navigation';
import InviteClient from './InviteClient';

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    notFound();
  }

  const lang = (invitation.language?.toLowerCase() || 'ru') as Lang;

  return <InviteClient invitation={invitation} lang={lang} slug={slug} />;
}
