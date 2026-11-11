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
  italicPhrases?: string[];
}

export const SplitScrollText: React.FC<SplitScrollTextProps> = ({
  text,
  as: Tag = 'p',
  className = '',
  triggerStart = 'top 85%',
  triggerEnd = 'bottom 48%',
}) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const chars = el.querySelectorAll<HTMLElement>('.split-char');
    if (!chars.length) return;

    if (prefersReducedMotion) {
      gsap.set(chars, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        {
          opacity: 0.14,
          y: 6,
        },
        {
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.018,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            end: triggerEnd,
            scrub: 0.65,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [text, triggerStart, triggerEnd]);

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
              <span key={charIdx} className="split-char">
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
