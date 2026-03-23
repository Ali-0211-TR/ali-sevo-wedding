'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { t, i18n, type Lang } from '@/i18n/translations';
import CountdownTimer from '@/components/CountdownTimer';
import { ChevronDown, MapPin, Calendar, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import Link from 'next/link';

interface Block {
  id: string;
  type: string;
  content: any;
  settings?: any;
  sortOrder: number;
}

interface Props {
  blocks: Block[];
  lang: Lang;
  events?: any[];
  blogPosts?: any[];
}

/* ─── Animation variants ────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ─── Animated section wrapper ──────────────────────────── */

function AnimatedSection({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.section
      ref={ref}
      className={className}
      style={style}
      variants={fadeUp}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {children}
    </motion.section>
  );
}

/* ─── Block Renderer ────────────────────────────────────── */

export default function BlockRenderer({ blocks, lang, events = [], blogPosts = [] }: Props) {
  const sorted = [...blocks].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {sorted.map((block) => (
        <RenderBlock key={block.id} block={block} lang={lang} events={events} blogPosts={blogPosts} />
      ))}
    </>
  );
}

function RenderBlock({
  block,
  lang,
  events,
  blogPosts,
}: {
  block: Block;
  lang: Lang;
  events: any[];
  blogPosts: any[];
}) {
  const content = block.content || {};
  const settings = block.settings || {};

  switch (block.type) {
    case 'HERO':
      return <HeroBlock content={content} lang={lang} />;
    case 'TEXT':
      return <TextBlock content={content} lang={lang} />;
    case 'IMAGE':
      return <ImageBlock content={content} lang={lang} />;
    case 'GALLERY':
      return <GalleryBlock content={content} lang={lang} />;
    case 'VIDEO':
      return <VideoBlock content={content} lang={lang} />;
    case 'COUNTDOWN':
      return <CountdownBlock content={content} lang={lang} />;
    case 'EVENT_LIST':
      return <EventListBlock events={events} lang={lang} />;
    case 'RSVP_FORM':
      return <RsvpPlaceholder lang={lang} />;
    case 'MAP':
      return <MapBlock content={content} />;
    case 'CUSTOM_HTML':
      return <CustomHtmlBlock content={content} lang={lang} />;
    case 'BLOG_LIST':
      return <BlogListBlock blogPosts={blogPosts} lang={lang} />;
    case 'TIMELINE':
      return <TimelineBlock content={content} lang={lang} />;
    case 'COUPLE_INFO':
      return <CoupleInfoBlock content={content} lang={lang} />;
    default:
      return null;
  }
}

/* ─── HERO ──────────────────────────────────────────────── */

function HeroBlock({ content, lang }: { content: any; lang: Lang }) {
  const title = t(content.title, lang);
  const subtitle = t(content.subtitle, lang);
  const bgImage = content.backgroundImage || content.image;

  return (
    <section
      className="hero-section"
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : { background: 'linear-gradient(135deg, var(--accent-dark), var(--primary), var(--secondary))' }}
    >
      <div className="hero-content">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      <motion.div
        className="hero-scroll-indicator"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <ChevronDown size={32} color="rgba(255,255,255,0.8)" />
      </motion.div>
    </section>
  );
}

/* ─── TEXT ───────────────────────────────────────────────── */

function TextBlock({ content, lang }: { content: any; lang: Lang }) {
  const title = t(content.title, lang);
  const body = t(content.body || content.text || content.content, lang);

  return (
    <AnimatedSection className="section">
      <div className="container-narrow" style={{ textAlign: 'center' }}>
        {title && <h2 className="section-title">{title}</h2>}
        {body && (
          <div
            style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-light)' }}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        )}
      </div>
    </AnimatedSection>
  );
}

/* ─── IMAGE ─────────────────────────────────────────────── */

function ImageBlock({ content, lang }: { content: any; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const caption = t(content.caption, lang);

  return (
    <motion.section
      ref={ref}
      className="section"
      variants={scaleIn}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <div className="container" style={{ textAlign: 'center' }}>
        <img
          src={content.url || content.image || content.src}
          alt={caption || ''}
          style={{ borderRadius: 'var(--radius-lg)', maxWidth: '100%', margin: '0 auto', boxShadow: 'var(--shadow-lg)' }}
        />
        {caption && (
          <p style={{ marginTop: '1rem', fontStyle: 'italic', color: 'var(--text-muted)' }}>{caption}</p>
        )}
      </div>
    </motion.section>
  );
}

/* ─── GALLERY ───────────────────────────────────────────── */

function GalleryBlock({ content, lang }: { content: any; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const images: any[] = content.images || [];
  const title = t(content.title, lang);

  return (
    <section className="section" ref={ref}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        <motion.div
          className="gallery-grid"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {images.map((img: any, idx: number) => (
            <motion.div
              key={idx}
              className="gallery-item"
              variants={scaleIn}
            >
              <img src={typeof img === 'string' ? img : img.url || img.src} alt={img.alt || ''} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── VIDEO ─────────────────────────────────────────────── */

function VideoBlock({ content, lang }: { content: any; lang: Lang }) {
  const url = content.url || content.src;
  const title = t(content.title, lang);
  const isEmbed = url && (url.includes('youtube') || url.includes('vimeo'));

  return (
    <AnimatedSection className="section">
      <div className="container" style={{ textAlign: 'center' }}>
        {title && <h2 className="section-title">{title}</h2>}
        {isEmbed ? (
          <div style={{ position: 'relative', paddingBottom: '56.25%', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)' }}>
            <iframe
              src={url}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : url ? (
          <video
            src={url}
            controls
            style={{ maxWidth: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
          />
        ) : null}
      </div>
    </AnimatedSection>
  );
}

/* ─── COUNTDOWN ─────────────────────────────────────────── */

function CountdownBlock({ content, lang }: { content: any; lang: Lang }) {
  const title = t(content.title, lang);

  return (
    <AnimatedSection className="section section-alt">
      <div className="container" style={{ textAlign: 'center' }}>
        {title && <h2 className="section-title">{title}</h2>}
        <CountdownTimer targetDate={content.targetDate || content.date} lang={lang} />
      </div>
    </AnimatedSection>
  );
}

/* ─── EVENT LIST ────────────────────────────────────────── */

function EventListBlock({ events, lang }: { events: any[]; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <motion.div
          className="event-list-grid"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {events.map((event: any) => (
            <motion.div key={event.id} className="event-card" variants={fadeUp}>
              {event.coverImage && (
                <img
                  src={event.coverImage}
                  alt={t(event.title, lang)}
                  style={{ width: '100%', aspectRatio: '16/10', objectFit: 'cover', borderRadius: 'var(--radius) var(--radius) 0 0', marginBottom: '1rem' }}
                />
              )}
              <h3>{t(event.title, lang)}</h3>
              <p className="event-date">
                <Calendar size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                {dayjs(event.date).format('D MMMM YYYY')}
              </p>
              <p className="event-date">
                <Clock size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                {dayjs(event.date).format('HH:mm')}
              </p>
              {event.location && (
                <p className="event-location">
                  <MapPin size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: '-2px' }} />
                  {event.location}
                </p>
              )}
              {event.description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                  {t(event.description, lang)}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── RSVP PLACEHOLDER ──────────────────────────────────── */

function RsvpPlaceholder({ lang }: { lang: Lang }) {
  return (
    <AnimatedSection className="section section-alt">
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 className="section-title">RSVP</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: 500, margin: '0 auto' }}>
          {lang === 'ru'
            ? 'Для ответа на приглашение, пожалуйста, используйте персональную ссылку, отправленную вам.'
            : lang === 'uz'
            ? "Taklifga javob berish uchun sizga yuborilgan shaxsiy havoladan foydalaning."
            : lang === 'tr'
            ? 'Davetiyeye yanıt vermek için size gönderilen kişisel bağlantıyı kullanın.'
            : 'To RSVP, please use the personal link sent to you.'}
        </p>
      </div>
    </AnimatedSection>
  );
}

/* ─── MAP ───────────────────────────────────────────────── */

function MapBlock({ content }: { content: any }) {
  const src = content.embedUrl || content.url || content.src;
  if (!src) return null;

  return (
    <AnimatedSection className="section">
      <div className="container">
        <div className="map-container">
          <iframe src={src} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </AnimatedSection>
  );
}

/* ─── CUSTOM HTML ───────────────────────────────────────── */

function CustomHtmlBlock({ content, lang }: { content: any; lang: Lang }) {
  const html = t(content.html || content.content, lang);

  return (
    <AnimatedSection className="section">
      <div className="container" dangerouslySetInnerHTML={{ __html: html }} />
    </AnimatedSection>
  );
}

/* ─── BLOG LIST ─────────────────────────────────────────── */

function BlogListBlock({ blogPosts, lang }: { blogPosts: any[]; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const posts = blogPosts.slice(0, 6);

  return (
    <section className="section" ref={ref}>
      <div className="container">
        <h2 className="section-title">{i18n('nav.blog', lang)}</h2>
        <motion.div
          className="blog-grid"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {posts.map((post: any) => (
            <motion.div key={post.id} variants={fadeUp}>
              <Link href={`/${lang}/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article className="blog-card">
                  {post.coverImage && <img src={post.coverImage} alt={t(post.title, lang)} className="blog-card-image" />}
                  <div className="blog-card-body">
                    {post.publishedAt && (
                      <p className="blog-card-date">{dayjs(post.publishedAt).format('D MMMM YYYY')}</p>
                    )}
                    <h3>{t(post.title, lang)}</h3>
                    {post.excerpt && <p>{t(post.excerpt, lang)}</p>}
                    <span className="read-more">{i18n('blog.readMore', lang)} →</span>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── TIMELINE ──────────────────────────────────────────── */

function TimelineBlock({ content, lang }: { content: any; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const items: any[] = content.items || [];
  const title = t(content.title, lang);

  return (
    <section className="section section-alt" ref={ref}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        <motion.div
          className="timeline"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {items.map((item: any, idx: number) => (
            <motion.div key={idx} className="timeline-item" variants={fadeUp}>
              <div className="timeline-dot" />
              <div className="timeline-content">
                {item.date && <p className="timeline-date">{t(item.date, lang)}</p>}
                <h4>{t(item.title, lang)}</h4>
                {item.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    {t(item.description, lang)}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── COUPLE INFO ───────────────────────────────────────── */

function CoupleInfoBlock({ content, lang }: { content: any; lang: Lang }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const title = t(content.title, lang);
  const story = t(content.story, lang);
  const person1 = content.person1 || {};
  const person2 = content.person2 || {};

  return (
    <section className="section" ref={ref}>
      <div className="container">
        {title && <h2 className="section-title">{title}</h2>}
        <motion.div
          className="couple-section"
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          <motion.div className="couple-person" variants={fadeUp}>
            {person1.photo && <img src={person1.photo} alt={t(person1.name, lang)} className="couple-photo" />}
            <p className="couple-name">{t(person1.name, lang)}</p>
            {person1.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t(person1.description, lang)}</p>
            )}
          </motion.div>
          <motion.div className="couple-person" variants={fadeUp}>
            {person2.photo && <img src={person2.photo} alt={t(person2.name, lang)} className="couple-photo" />}
            <p className="couple-name">{t(person2.name, lang)}</p>
            {person2.description && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t(person2.description, lang)}</p>
            )}
          </motion.div>
          {story && (
            <motion.div className="couple-story" variants={fadeUp}>
              <p>{story}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
