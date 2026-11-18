import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SplitScrollTextProps {
  text: string;
  as?: 'p' | 'h2' | 'h3' | 'blockquote' | 'div';
  className?: string;
  /** Viewport ratio where the TOP of the text starts revealing (0 = top, 1 = bottom). */
  startRatio?: number;
  /** Viewport ratio where the BOTTOM of the text must be when reveal completes. */
  endRatio?: number;
}

const MIN_OPACITY = 0.16;

/**
 * Scroll-linked progressive text reveal.
 * - Progress is based on the element's top AND height, so long texts on mobile
 *   (many lines) reveal gradually while being read instead of finishing too early.
 * - Driven by the GSAP ticker (every frame) while visible, so it also follows
 *   iOS/Android momentum scrolling, which throttles native scroll events.
 */
export const SplitScrollText: React.FC<SplitScrollTextProps> = ({
  text,
  as: Tag = 'p',
  className = '',
  startRatio = 0.9,
  endRatio = 0.58,
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>('.split-char'));
    if (!chars.length) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      chars.forEach((c) => (c.style.opacity = '1'));
      return;
    }

    const total = chars.length;
    const spread = Math.max(4, Math.round(total * 0.1));
    let lastPoint = -1;
    let isVisible = false;

    const update = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = vh * startRatio;
      const range = Math.max(startY - vh * endRatio + rect.height, 1);
      const progress = Math.min(Math.max((startY - rect.top) / range, 0), 1);
      const point = Math.round(progress * (total + spread) * 10) / 10;

      if (point === lastPoint) return;
      lastPoint = point;

      for (let i = 0; i < total; i++) {
        const dist = point - i;
        const alpha = dist >= spread ? 1 : dist > 0 ? dist / spread : 0;
        chars[i].style.opacity = (MIN_OPACITY + alpha * (1 - MIN_OPACITY)).toFixed(3);
      }
    };

    const tick = () => {
      if (isVisible) update();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) update();
      },
      { rootMargin: '15% 0px 15% 0px' }
    );

    observer.observe(el);
    gsap.ticker.add(tick);
    update();

    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
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
                style={{ opacity: MIN_OPACITY }}
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
