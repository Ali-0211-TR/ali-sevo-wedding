import { getSettings, getPublicPages } from '@/lib/api';
import { t, type Lang, languages } from '@/i18n/translations';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import MusicPlayer from '@/components/MusicPlayer';
import Link from 'next/link';
import { Instagram, Send } from 'lucide-react';

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = await params;
  const lang = (languages.some((l) => l.code === langParam) ? langParam : 'ru') as Lang;
  const [settings, pages] = await Promise.all([getSettings(), getPublicPages()]);

  const coupleNames = settings ? t(settings.coupleNames, lang) : '';
  const navPages = (pages || []).filter((p: any) => p.isPublished && p.showInNav);

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <div className="header-logo">
            <Link href={`/${lang}`}>{coupleNames || '♡'}</Link>
          </div>
          <nav className="header-nav">
            {navPages.map((page: any) => (
              <Link key={page.id} href={page.slug === 'home' ? `/${lang}` : `/${lang}/${page.slug}`}>
                {t(page.title, lang)}
              </Link>
            ))}
            <Link href={`/${lang}/blog`}>Blog</Link>
            <LanguageSwitcher currentLang={lang} />
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="footer-inner">
          {(settings?.instagramUrl || settings?.telegramUrl) && (
            <div className="footer-social">
              {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={22} />
                </a>
              )}
              {settings.telegramUrl && (
                <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer" aria-label="Telegram">
                  <Send size={22} />
                </a>
              )}
            </div>
          )}
          <div className="footer-hearts">{coupleNames || '♡'}</div>
          <p style={{ fontSize: '0.85rem' }}>
            {settings?.weddingDate
              ? new Date(settings.weddingDate).getFullYear()
              : new Date().getFullYear()}
          </p>
        </div>
      </footer>

      {settings?.backgroundMusicUrl && (
        <MusicPlayer
          musicUrl={settings.backgroundMusicUrl}
          autoplay={settings.musicAutoplay ?? false}
        />
      )}
    </>
  );
}
