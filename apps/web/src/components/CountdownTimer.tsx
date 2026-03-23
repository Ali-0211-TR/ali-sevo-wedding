'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { i18n, type Lang } from '@/i18n/translations';

interface CountdownTimerProps {
  targetDate: string;
  lang: Lang;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ targetDate, lang }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(targetDate));
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const tl = calcTimeLeft(targetDate);
      if (!tl) {
        setPassed(true);
        clearInterval(interval);
      }
      setTimeLeft(tl);
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (passed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: 'center',
          padding: '2rem',
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.5rem',
          color: 'var(--accent)',
        }}
      >
        🎉{' '}
        {lang === 'ru'
          ? 'Этот день настал!'
          : lang === 'uz'
          ? 'Bu kun keldi!'
          : lang === 'tr'
          ? 'Bugün o gün!'
          : 'Today is the day!'}
      </motion.div>
    );
  }

  if (!timeLeft) return null;

  const units: { key: keyof TimeLeft; label: string }[] = [
    { key: 'days', label: i18n('countdown.days', lang) },
    { key: 'hours', label: i18n('countdown.hours', lang) },
    { key: 'minutes', label: i18n('countdown.minutes', lang) },
    { key: 'seconds', label: i18n('countdown.seconds', lang) },
  ];

  return (
    <div className="countdown-container">
      {units.map(({ key, label }) => (
        <div className="countdown-box" key={key}>
          <AnimatePresence mode="popLayout">
            <motion.div
              key={timeLeft[key]}
              className="countdown-number"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {String(timeLeft[key]).padStart(2, '0')}
            </motion.div>
          </AnimatePresence>
          <div className="countdown-label">{label}</div>
        </div>
      ))}
    </div>
  );
}
