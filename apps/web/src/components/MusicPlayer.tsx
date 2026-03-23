'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Pause } from 'lucide-react';

interface MusicPlayerProps {
  musicUrl: string;
  autoplay?: boolean;
}

export default function MusicPlayer({ musicUrl, autoplay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;

    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [musicUrl]);

  const tryAutoplay = useCallback(() => {
    if (!hasInteracted && autoplay && audioRef.current) {
      setHasInteracted(true);
      audioRef.current.play().catch(() => {});
    }
  }, [hasInteracted, autoplay]);

  useEffect(() => {
    if (autoplay) {
      const handler = () => tryAutoplay();
      document.addEventListener('click', handler, { once: true });
      document.addEventListener('scroll', handler, { once: true });
      document.addEventListener('touchstart', handler, { once: true });
      return () => {
        document.removeEventListener('click', handler);
        document.removeEventListener('scroll', handler);
        document.removeEventListener('touchstart', handler);
      };
    }
  }, [autoplay, tryAutoplay]);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  };

  return (
    <div className="music-player">
      <motion.button
        className="music-btn"
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.span
              key="pause"
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              <Pause size={20} />
            </motion.span>
          ) : (
            <motion.span
              key="play"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: -90 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex' }}
            >
              <Music size={20} />
            </motion.span>
          )}
        </AnimatePresence>
        {isPlaying && <span className="music-pulse" />}
      </motion.button>
    </div>
  );
}
