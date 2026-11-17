import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const MARQUEE_KEYWORDS = [
  'Ansiedade',
  'Depressão',
  'Luto',
  'Crises emocionais',
  'Autoestima',
  'Relacionamentos',
  'Transtorno bipolar',
  'Adolescentes',
  'Adultos',
  'Idosos',
] as const;

export const ScrollKeywordsMarquee: React.FC = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    const firstGroup = firstGroupRef.current;
    if (!track || !firstGroup) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(track, { x: 0 });
      return;
    }

    const setTrackX = gsap.quickSetter(track, 'x', 'px');
    let groupWidth = firstGroup.offsetWidth || 1;

    const measureWidth = () => {
      if (firstGroup) {
        const w = firstGroup.offsetWidth;
        if (w > 0) groupWidth = w;
      }
    };

    measureWidth();
    // Re-measure after fonts load and on window resize
    window.addEventListener('resize', measureWidth);
    if (document.fonts) {
      document.fonts.ready.then(measureWidth);
    }

    // Gentle speed multiplier: 0.28px horizontal travel per 1px vertical scroll
    const speed = 0.28;
    let targetX = 0;
    let currentX = 0;
    let isMoving = false;

    const updateTarget = (scrollY: number) => {
      if (groupWidth <= 0) return;
      const distance = scrollY * speed;
      // Modulo math ensures seamless continuous wrap in both scroll directions
      const mod = ((distance % groupWidth) + groupWidth) % groupWidth;
      targetX = -mod;
      isMoving = true;
    };

    const onTick = () => {
      if (!isMoving) return;
      const diff = targetX - currentX;
      if (Math.abs(diff) > groupWidth / 2) {
        currentX = targetX;
      } else if (Math.abs(diff) < 0.15) {
        currentX = targetX;
        isMoving = false;
      } else {
        currentX += diff * 0.14; // smooth, gentle glide
      }
      setTrackX(currentX);
    };

    gsap.ticker.add(onTick);

    // Hook into GSAP ScrollTrigger so it updates synchronously with Lenis / GSAP ticker
    const trigger = ScrollTrigger.create({
      onUpdate: (self) => {
        updateTarget(self.scroll());
      },
    });

    // Native scroll event fallback for instant reactivity
    const onNativeScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      updateTarget(scrollY);
    };

    window.addEventListener('scroll', onNativeScroll, { passive: true });

    // Initial position sync
    const initialScroll = window.scrollY || document.documentElement.scrollTop;
    updateTarget(initialScroll);
    currentX = targetX;
    setTrackX(currentX);

    return () => {
      trigger.kill();
      gsap.ticker.remove(onTick);
      window.removeEventListener('scroll', onNativeScroll);
      window.removeEventListener('resize', measureWidth);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="scroll-keywords-marquee"
      aria-label="Palavras-chave de cuidado clínico"
    >
      <div className="scroll-keywords-marquee__viewport">
        <div ref={trackRef} className="scroll-keywords-marquee__track">
          {[0, 1, 2, 3, 4, 5].map((groupIndex) => (
            <div
              key={groupIndex}
              ref={groupIndex === 0 ? firstGroupRef : undefined}
              className="scroll-keywords-marquee__group"
              aria-hidden={groupIndex > 0 ? 'true' : undefined}
            >
              {MARQUEE_KEYWORDS.map((keyword, idx) => (
                <React.Fragment key={idx}>
                  <span className="scroll-keywords-marquee__word">
                    {keyword}
                  </span>
                  <span
                    className="scroll-keywords-marquee__separator"
                    aria-hidden="true"
                  >
                    •
                  </span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
