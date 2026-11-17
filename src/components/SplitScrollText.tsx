import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SplitScrollTextProps {
  text: string;
  as?: 'p' | 'h2' | 'h3' | 'blockquote' | 'div';
  className?: string;
  triggerStart?: string;
  triggerEnd?: string;
  startRatio?: number; // viewport height ratio where reveal starts (default 0.84)
  endRatio?: number;   // viewport height ratio where reveal finishes (default 0.36)
}

export const SplitScrollText: React.FC<SplitScrollTextProps> = ({
  text,
  as: Tag = 'p',
  className = '',
  startRatio = 0.84,
  endRatio = 0.36,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const chars = Array.from(el.querySelectorAll<HTMLElement>('.split-char'));
    if (!chars.length) return;

    if (prefersReducedMotion) {
      chars.forEach((c) => {
        c.style.opacity = '1';
      });
      return;
    }

    const total = chars.length;
    const spread = Math.max(3, Math.round(total * 0.08));

    const updateReveal = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = vh * startRatio;
      const endY = vh * endRatio;

      const rawProgress = (startY - rect.top) / Math.max(startY - endY, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const currentPoint = progress * (total + spread);

      for (let i = 0; i < total; i++) {
        const dist = currentPoint - i;
        let alpha = 0;
        if (dist >= spread) {
          alpha = 1;
        } else if (dist > 0) {
          alpha = dist / spread;
        }
        const opacity = 0.16 + alpha * 0.84;
        chars[i].style.opacity = opacity.toFixed(3);
      }
    };

    // Initial state calculation
    updateReveal();

    // Sync with GSAP ScrollTrigger (Lenis ticker) + native scroll/resize events
    const trigger = ScrollTrigger.create({
      onUpdate: updateReveal,
    });

    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);

    return () => {
      trigger.kill();
      window.removeEventListener('scroll', updateReveal);
      window.removeEventListener('resize', updateReveal);
    };
  }, [text, startRatio, endRatio]);

  const words = text.split(' ');

  return (
    <Tag
      ref={containerRef as React.RefObject<any>}
      className={`split-scroll-text ${className}`}
      aria-label={text}
    >
      {words.map((word, wordIdx) => (
        <React.Fragment key={wordIdx}>
          <span className="split-word" aria-hidden="true">
            {Array.from(word).map((char, charIdx) => (
              <span
                key={charIdx}
                className="split-char"
                style={{ opacity: 0.16 }}
              >
                {char}
              </span>
            ))}
          </span>
          {wordIdx < words.length - 1 && (
            <span className="split-space" aria-hidden="true">
              {' '}
            </span>
          )}
        </React.Fragment>
      ))}
    </Tag>
  );
};
