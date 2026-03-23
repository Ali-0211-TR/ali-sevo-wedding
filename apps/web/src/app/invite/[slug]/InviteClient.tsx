'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { t, i18n, type Lang } from '@/i18n/translations';
import { Heart, MapPin, Calendar, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import RsvpForm from '@/components/RsvpForm';

interface InviteClientProps {
  invitation: any;
  lang: Lang;
  slug: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
} as const;

export default function InviteClient({ invitation, lang, slug }: InviteClientProps) {
  const greeting = invitation.customGreeting
    ? t(tryParse(invitation.customGreeting), lang)
    : i18n('invite.you_are_invited', lang);

  const message = invitation.customMessage
    ? t(tryParse(invitation.customMessage), lang)
    : null;

  const closing = invitation.customClosing
    ? t(tryParse(invitation.customClosing), lang)
    : null;

  const events = (invitation.invitationEvents || []).map((ie: any) => ie.event).filter(Boolean);
  const guests = invitation.guests || [];

  return (
    <div className="invite-page">
      {/* Hero */}
      <motion.div
        className="invite-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 15 }}
          style={{ marginBottom: '1.5rem' }}
        >
          <Heart
            size={48}
            color="var(--primary)"
            fill="var(--secondary)"
            strokeWidth={1.5}
          />
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {greeting}
        </motion.h1>

        {guests.length > 0 && (
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-light)',
              marginTop: '0.75rem',
              fontFamily: "'Playfair Display', serif",
            }}
          >
            {guests.map((g: any) => `${g.firstName} ${g.lastName}`).join(' & ')}
          </motion.p>
        )}
      </motion.div>

      {/* Message */}
      {message && (
        <motion.div
          className="invite-message"
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {message}
        </motion.div>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="invite-section">
          <motion.h2
            className="invite-section-title"
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            {i18n('invite.events', lang)}
          </motion.h2>

          <div className="event-list-grid">
            {events.map((event: any, idx: number) => (
              <motion.div
                key={event.id}
                className="event-card"
                custom={5 + idx}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
              >
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
                {event.address && (
                  <p className="event-location" style={{ fontSize: '0.85rem' }}>
                    {event.address}
                  </p>
                )}
                {event.description && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginTop: '0.75rem' }}>
                    {t(event.description, lang)}
                  </p>
                )}
                {event.mapUrl && (
                  <a
                    href={event.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      marginTop: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    <MapPin size={14} /> Map
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* RSVP */}
      {guests.length > 0 && (
        <section className="invite-section">
          <motion.h2
            className="invite-section-title"
            custom={6 + events.length}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            RSVP
          </motion.h2>
          <RsvpForm invitation={invitation} lang={lang} slug={slug} />
        </section>
      )}

      {/* Closing */}
      {closing && (
        <motion.div
          className="invite-message"
          style={{ paddingBottom: '4rem' }}
          custom={8 + events.length}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          {closing}
        </motion.div>
      )}
    </div>
  );
}

function tryParse(val: any): any {
  if (typeof val === 'string') {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
}
