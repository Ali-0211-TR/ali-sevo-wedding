'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { languages, type Lang } from '@/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLang: Lang;
}

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const current = languages.find((l) => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLang = (code: Lang) => {
    setOpen(false);
    // Replace the lang segment in the path
    const segments = pathname.split('/');
    if (segments.length >= 2 && languages.some((l) => l.code === segments[1])) {
      segments[1] = code;
    } else {
      segments.splice(1, 0, code);
    }
    router.push(segments.join('/') || '/');
  };

  return (
    <div className="lang-switcher" ref={ref}>
      <button className="lang-switcher-btn" onClick={() => setOpen(!open)}>
        <span>{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
        <ChevronDown size={14} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lang-switcher-dropdown"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                className={`lang-option ${lang.code === currentLang ? 'active' : ''}`}
                onClick={() => switchLang(lang.code)}
              >
                <span>{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
