'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { i18n, type Lang } from '@/i18n/translations';
import { submitRsvp } from '@/lib/api';
import { Check, X, HelpCircle, Loader2, Heart } from 'lucide-react';

interface RsvpFormProps {
  invitation: any;
  lang: Lang;
  slug: string;
}

interface GuestRsvp {
  status: string;
  message: string;
  dietaryNeeds: string;
}

export default function RsvpForm({ invitation, lang, slug }: RsvpFormProps) {
  const guests: any[] = invitation.guests || [];
  const [responses, setResponses] = useState<Record<string, GuestRsvp>>(() => {
    const init: Record<string, GuestRsvp> = {};
    guests.forEach((g) => {
      init[g.id] = {
        status: g.rsvpStatus || 'PENDING',
        message: g.rsvpMessage || '',
        dietaryNeeds: g.dietaryNeeds || '',
      };
    });
    return init;
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGuest = (guestId: string, field: keyof GuestRsvp, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [guestId]: { ...prev[guestId], [field]: value },
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      for (const guest of guests) {
        const r = responses[guest.id];
        if (r && r.status !== 'PENDING') {
          await submitRsvp(slug, {
            guestId: guest.id,
            status: r.status,
            message: r.message || undefined,
            dietaryNeeds: r.dietaryNeeds || undefined,
          });
        }
      }
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        className="success-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <motion.div
          className="success-icon"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 0],
          }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Heart size={64} color="var(--primary)" fill="var(--secondary)" />
        </motion.div>
        <motion.p
          className="success-message"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {i18n('rsvp.thankYou', lang)}
        </motion.p>
        {/* Confetti-like particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 8,
              height: 8,
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              background: ['var(--primary)', 'var(--secondary)', 'var(--accent)', '#e8d0b3', '#c9a882'][i % 5],
              left: `${20 + Math.random() * 60}%`,
              top: '30%',
              pointerEvents: 'none',
            }}
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: 0,
              y: 150 + Math.random() * 200,
              x: (Math.random() - 0.5) * 300,
              rotate: Math.random() * 720,
            }}
            transition={{ duration: 1.5 + Math.random(), delay: Math.random() * 0.3, ease: 'easeOut' }}
          />
        ))}
      </motion.div>
    );
  }

  const statusConfig = [
    { value: 'ACCEPTED', label: i18n('rsvp.accept', lang), className: 'active-accept', icon: <Check size={16} /> },
    { value: 'DECLINED', label: i18n('rsvp.decline', lang), className: 'active-decline', icon: <X size={16} /> },
    { value: 'MAYBE', label: i18n('rsvp.maybe', lang), className: 'active-maybe', icon: <HelpCircle size={16} /> },
  ];

  return (
    <div className="rsvp-form" style={{ position: 'relative' }}>
      {guests.map((guest, idx) => (
        <motion.div
          key={guest.id}
          className="rsvp-guest-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.5 }}
        >
          <p className="rsvp-guest-name">
            {guest.firstName} {guest.lastName}
          </p>

          <div className="rsvp-status-buttons">
            {statusConfig.map(({ value, label, className, icon }) => (
              <button
                key={value}
                type="button"
                className={`rsvp-btn ${responses[guest.id]?.status === value ? className : ''}`}
                onClick={() => updateGuest(guest.id, 'status', value)}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  {icon} {label}
                </span>
              </button>
            ))}
          </div>

          <div className="rsvp-field">
            <label>{i18n('rsvp.message', lang)}</label>
            <textarea
              className="rsvp-textarea"
              value={responses[guest.id]?.message || ''}
              onChange={(e) => updateGuest(guest.id, 'message', e.target.value)}
              rows={2}
            />
          </div>

          <div className="rsvp-field">
            <label>{i18n('rsvp.dietary', lang)}</label>
            <input
              className="rsvp-input"
              type="text"
              value={responses[guest.id]?.dietaryNeeds || ''}
              onChange={(e) => updateGuest(guest.id, 'dietaryNeeds', e.target.value)}
            />
          </div>
        </motion.div>
      ))}

      {error && (
        <p style={{ color: '#c1121f', textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}

      <motion.button
        className="rsvp-submit-btn"
        onClick={handleSubmit}
        disabled={submitting}
        whileTap={{ scale: 0.97 }}
      >
        {submitting ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            {i18n('rsvp.submit', lang)}...
          </span>
        ) : (
          i18n('rsvp.submit', lang)
        )}
      </motion.button>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
