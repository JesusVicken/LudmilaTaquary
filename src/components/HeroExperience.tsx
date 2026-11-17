import React, { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';
import { OrganicShaderCanvas } from './OrganicShaderCanvas';

gsap.registerPlugin(ScrollTrigger);

interface HeroExperienceProps {
  onPreloaderComplete: () => void;
  onNavigateAbout: () => void;
  onNavigateSection?: (targetId: string) => void;
}

export const HeroExperience: React.FC<HeroExperienceProps> = ({
  onPreloaderComplete,
  onNavigateAbout,
  onNavigateSection,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const preloaderBlackRef = useRef<HTMLDivElement | null>(null);
  const preloaderMetaRef = useRef<HTMLDivElement | null>(null);
  const curtainGreenRef = useRef<HTMLDivElement | null>(null);
  const curtainSandRef = useRef<HTMLDivElement | null>(null);

  const titleWrapperRef = useRef<HTMLDivElement | null>(null);
  const wordLudmilaRef = useRef<HTMLSpanElement | null>(null);
  const wordTaquaryRef = useRef<HTMLSpanElement | null>(null);

  const topLeftBlockRef = useRef<HTMLDivElement | null>(null);
  const credentialsClusterRef = useRef<HTMLDivElement | null>(null);
  const heroPortraitCardRef = useRef<HTMLDivElement | null>(null);
  const bottomDividerRef = useRef<HTMLDivElement | null>(null);
  const bottomBarRef = useRef<HTMLDivElement | null>(null);

  const centerPortalWrapRef = useRef<HTMLDivElement | null>(null);
  const centerPortalInnerRef = useRef<HTMLDivElement | null>(null);
  const centerPortalCaptionRef = useRef<HTMLDivElement | null>(null);

  const [loadPercent, setLoadPercent] = useState(0);
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [typingActive, setTypingActive] = useState(false);
  const [typedCount, setTypedCount] = useState(0);

  const quoteText = LUDMILA_CONTENT.hero.upperLeftQuote;

  // Pre-compute word/character tokens with global character indices so words never wrap-jump mid-typing
  const quoteTokens = useMemo(() => {
    const words = quoteText.split(' ');
    let globalIndex = 0;
    return words.map((word, wordIdx) => {
      const chars = Array.from(word).map((char) => {
        const item = { char, index: globalIndex };
        globalIndex += 1;
        return item;
      });
      const hasSpace = wordIdx < words.length - 1;
      const spaceIndex = hasSpace ? globalIndex : null;
      if (hasSpace) globalIndex += 1;
      return { word, chars, hasSpace, spaceIndex };
    });
  }, [quoteText]);

  // Typewriter cadence effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setTypedCount(quoteText.length);
      return;
    }

    if (!typingActive) return;

    if (typedCount >= quoteText.length) return;

    const prevChar = typedCount > 0 ? quoteText[typedCount - 1] : '';
    let delay = 34;
    if (prevChar === ',') {
      delay = 220; // Natural breath pause after comma
    } else if (prevChar === '.') {
      delay = 140;
    } else if (typedCount === 0) {
      delay = 120;
    }

    const timer = window.setTimeout(() => {
      setTypedCount((prev) => Math.min(prev + 1, quoteText.length));
    }, delay);

    return () => window.clearTimeout(timer);
  }, [typingActive, typedCount, quoteText]);

  // 1. Preloader sequence + seamless transition to Hero
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setLoadPercent(100);
      setPreloaderDone(true);
      setTypingActive(true);
      setTypedCount(quoteText.length);
      gsap.set(
        [
          topLeftBlockRef.current,
          credentialsClusterRef.current,
          heroPortraitCardRef.current,
          bottomBarRef.current,
        ],
        { autoAlpha: 1, y: 0 }
      );
      gsap.set(bottomDividerRef.current, { scaleX: 1 });
      onPreloaderComplete();
      return;
    }

    // Lock scroll during preloader
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);

    const counterObj = { val: 0 };

    const ctx = gsap.context(() => {
      // Calculate exact offset so the title starts perfectly centered in the viewport
      // at medium size on the black preloader screen, and then scales up to 100% width
      // and glides down to its exact resting spot in the Hero without any jump.
      const titleEl = titleWrapperRef.current;
      let startYOffset = -window.innerHeight * 0.25;
      if (titleEl) {
        const rect = titleEl.getBoundingClientRect();
        const titleCenterY = rect.top + rect.height / 2;
        const viewportCenterY = window.innerHeight / 2;
        startYOffset = viewportCenterY - titleCenterY;
      }

      gsap.set(titleWrapperRef.current, {
        y: startYOffset,
        scale: 0.31,
        transformOrigin: '50% 50%',
      });

      gsap.set(curtainGreenRef.current, { yPercent: 100 });
      gsap.set(curtainSandRef.current, { yPercent: 100 });
      gsap.set(centerPortalWrapRef.current, { autoAlpha: 0 });

      gsap.set(
        [
          topLeftBlockRef.current,
          credentialsClusterRef.current,
          heroPortraitCardRef.current,
          bottomBarRef.current,
        ],
        {
          autoAlpha: 0,
          y: 26,
        }
      );

      gsap.set(bottomDividerRef.current, {
        scaleX: 0,
        transformOrigin: '0% 50%',
      });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        onComplete: () => {
          document.body.style.overflow = originalOverflow;
          setPreloaderDone(true);
          onPreloaderComplete();
          ScrollTrigger.refresh();
        },
      });

      // Step A: Smooth loading progress 0 -> 100
      tl.to(counterObj, {
        val: 100,
        duration: 1.15,
        ease: 'power2.inOut',
        onUpdate: () => {
          setLoadPercent(Math.round(counterObj.val));
        },
      });

      // Step B: Fade out preloader counter metadata
      tl.to(
        preloaderMetaRef.current,
        {
          opacity: 0,
          y: -14,
          duration: 0.45,
          ease: 'power2.in',
        },
        '-=0.15'
      );

      // Step C:
      // 1. LUDMILA TAQUARY scales progressively to full screen width (scale -> 1)
      // 2. Moves smoothly toward the lower part of the screen (y -> 0)
      // 3. Layer 1 (Deep Olive Green) rises from bottom
      // 4. Layer 2 (Warm Sand/Beige) rises after it, transitioning preloader -> Hero
      tl.to(
        titleWrapperRef.current,
        {
          scale: 1,
          y: 0,
          duration: 1.55,
          ease: 'expo.inOut',
        },
        'transitionStart'
      );

      tl.to(
        curtainGreenRef.current,
        {
          yPercent: 0,
          duration: 1.05,
          ease: 'expo.inOut',
        },
        'transitionStart+=0.08'
      );

      tl.to(
        curtainSandRef.current,
        {
          yPercent: 0,
          duration: 1.05,
          ease: 'expo.inOut',
        },
        'transitionStart+=0.26'
      );

      // Hide black base once covered by curtains
      tl.set(
        preloaderBlackRef.current,
        { autoAlpha: 0 },
        'transitionStart+=1.12'
      );

      // Lift both curtains smoothly upward to unveil the live Hero WebGL shader
      tl.to(
        [curtainSandRef.current, curtainGreenRef.current],
        {
          yPercent: -102,
          duration: 1.05,
          stagger: 0.08,
          ease: 'expo.inOut',
        },
        'transitionStart+=0.98'
      );

      // Step D: Reveal Hero editorial elements smoothly AFTER preloader curtains open
      tl.to(
        bottomDividerRef.current,
        {
          scaleX: 1,
          duration: 1.0,
          ease: 'expo.out',
        },
        'transitionStart+=1.42'
      );

      tl.call(
        () => {
          setTypingActive(true);
        },
        [],
        'transitionStart+=1.48'
      );

      tl.to(
        [
          topLeftBlockRef.current,
          heroPortraitCardRef.current,
          credentialsClusterRef.current,
          bottomBarRef.current,
        ],
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.1,
          ease: 'power3.out',
        },
        'transitionStart+=1.48'
      );
    }, sectionRef);

    return () => {
      document.body.style.overflow = originalOverflow;
      ctx.revert();
    };
  }, [onPreloaderComplete, quoteText.length]);

  // 2. Scroll-linked pinned Hero animation (Title rises to center, splits, central photo expands)
  useEffect(() => {
    if (!preloaderDone) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      gsap.set(centerPortalWrapRef.current, {
        autoAlpha: 0,
        scale: isMobile ? 0.38 : 0.22,
        yPercent: 8,
      });

      gsap.set(centerPortalInnerRef.current, {
        scale: 1.18,
      });

      gsap.set(centerPortalCaptionRef.current, {
        opacity: 0,
        y: 16,
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: isMobile ? '+=185%' : '+=240%',
          pin: true,
          scrub: 0.85,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0 -> 0.38): Peripheral Hero elements recede while LUDMILA TAQUARY rises toward the center
      scrollTl.to(
        [
          topLeftBlockRef.current,
          credentialsClusterRef.current,
          bottomBarRef.current,
        ],
        {
          autoAlpha: 0,
          y: -28,
          duration: 0.32,
          ease: 'power2.inOut',
        },
        0
      );

      scrollTl.to(
        bottomDividerRef.current,
        {
          scaleX: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0
      );

      scrollTl.to(
        heroPortraitCardRef.current,
        {
          autoAlpha: 0,
          y: -45,
          scale: 0.92,
          duration: 0.35,
          ease: 'power2.inOut',
        },
        0
      );

      // LUDMILA TAQUARY rises gradually from bottom to the vertical center of the screen
      scrollTl.to(
        titleWrapperRef.current,
        {
          y: isMobile ? '-26vh' : '-29vh',
          scale: isMobile ? 0.92 : 0.86,
          duration: 0.44,
          ease: 'power2.inOut',
        },
        0
      );

      // Phase 2 (0.28 -> 0.78): Typographic elements separate (LUDMILA & TAQUARY move apart)
      // opening space in the center for the emerging photograph
      scrollTl.to(
        wordLudmilaRef.current,
        {
          y: isMobile ? '-16vh' : '-20vh',
          x: isMobile ? '-4vw' : '-7vw',
          scale: 0.88,
          duration: 0.52,
          ease: 'power2.inOut',
        },
        0.26
      );

      scrollTl.to(
        wordTaquaryRef.current,
        {
          y: isMobile ? '16vh' : '20vh',
          x: isMobile ? '4vw' : '7vw',
          scale: 0.88,
          duration: 0.52,
          ease: 'power2.inOut',
        },
        0.26
      );

      // Central photograph emerges in the center and progressively expands with the scroll
      scrollTl.to(
        centerPortalWrapRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          yPercent: 0,
          duration: 0.68,
          ease: 'power2.inOut',
        },
        0.24
      );

      scrollTl.to(
        centerPortalInnerRef.current,
        {
          scale: 1,
          duration: 0.68,
          ease: 'power2.out',
        },
        0.24
      );

      scrollTl.to(
        centerPortalCaptionRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out',
        },
        0.58
      );

      // Gentle final part of the pin before releasing into Section 02
      scrollTl.to(
        [wordLudmilaRef.current, wordTaquaryRef.current],
        {
          opacity: 0.22,
          duration: 0.22,
          ease: 'none',
        },
        0.76
      );
    }, section);

    return () => ctx.revert();
  }, [preloaderDone]);

  const isTypingComplete = typedCount >= quoteText.length;

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="hero-section"
      aria-label="Apresentação — Ludmila Taquary"
    >
      {/* WebGL Organic Shader Background */}
      <OrganicShaderCanvas className="hero-shader-bg" />

      {/* Subtle ambient radial depth overlay */}
      <div className="hero-ambient-overlay" aria-hidden="true" />

      {/* ═══ PRELOADER LAYERS (Black base + 2 rising curtains) ═══ */}
      <div
        ref={preloaderBlackRef}
        className={`preloader-layer preloader-layer--black ${
          preloaderDone ? 'is-hidden' : ''
        }`}
        aria-hidden="true"
      >
        <div ref={preloaderMetaRef} className="preloader-meta">
          <span className="preloader-meta__tag">
            PSICOLOGIA &amp; PSICANÁLISE LACANIANA
          </span>
          <span className="preloader-meta__counter">
            {String(loadPercent).padStart(2, '0')}%
          </span>
        </div>
      </div>

      <div
        ref={curtainGreenRef}
        className={`preloader-layer preloader-layer--green ${
          preloaderDone ? 'is-hidden' : ''
        }`}
        aria-hidden="true"
      />

      <div
        ref={curtainSandRef}
        className={`preloader-layer preloader-layer--sand ${
          preloaderDone ? 'is-hidden' : ''
        }`}
        aria-hidden="true"
      />

      {/* ═══ CENTRAL PORTAL PHOTOGRAPH (Emerges & expands during scroll) ═══ */}
      <div
        ref={centerPortalWrapRef}
        className="hero-portal-stage"
        aria-hidden="true"
      >
        <div className="hero-portal-frame">
          <img
            ref={centerPortalInnerRef as React.RefObject<HTMLImageElement>}
            src={LUDMILA_CONTENT.assets.photoDesk}
            alt="Ludmila Taquary em seu espaço de estudo e escuta clínica"
            className="hero-portal-img"
          />
          <div className="hero-portal-vignette" />
          <div ref={centerPortalCaptionRef} className="hero-portal-caption">
            <p className="hero-portal-caption__text">
              “A palavra ocupa um lugar central na construção de novos sentidos.”
            </p>
          </div>
        </div>
      </div>

      {/* ═══ HERO MAIN EDITORIAL GRID ═══ */}
      <div className="hero-editorial-container">
        {/* Top Row: Upper-left presentation text + Asymmetric Editorial Portrait + Credentials */}
        <div className="hero-upper-stage">
          {/* Upper-left presentation text with Typewriter Effect */}
          <div ref={topLeftBlockRef} className="hero-top-left">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow__dot" />
              <span>ORIENTAÇÃO LACANIANA</span>
            </div>
            <p
              className="hero-intro-quote hero-typewriter"
              aria-label={quoteText}
            >
              {typedCount === 0 && typingActive && (
                <span
                  className="typewriter-cursor is-blinking"
                  aria-hidden="true"
                />
              )}
              {quoteTokens.map((token, wordIdx) => (
                <React.Fragment key={wordIdx}>
                  <span className="typewriter-word" aria-hidden="true">
                    {token.chars.map((c) => {
                      const isTyped = c.index < typedCount;
                      const isCursorHere = c.index === typedCount - 1;
                      return (
                        <React.Fragment key={c.index}>
                          <span
                            className={`typewriter-char ${
                              isTyped ? 'is-typed' : ''
                            }`}
                          >
                            {c.char}
                          </span>
                          {isCursorHere && (
                            <span
                              className={`typewriter-cursor ${
                                isTypingComplete ? 'is-complete' : ''
                              }`}
                              aria-hidden="true"
                            />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </span>
                  {token.hasSpace && token.spaceIndex !== null && (
                    <span className="typewriter-space" aria-hidden="true">
                      {' '}
                      {token.spaceIndex === typedCount - 1 && (
                        <span
                          className="typewriter-cursor"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>

          {/* Center-Right Asymmetric Editorial Composition with Original Photograph */}
          <div className="hero-asymmetric-cluster">
            <div ref={credentialsClusterRef} className="hero-credentials-card">
              <p className="hero-credentials__role">
                {LUDMILA_CONTENT.credentials.role}
              </p>
              <p className="hero-credentials__crp">
                {LUDMILA_CONTENT.credentials.crp}
              </p>
              <div className="hero-credentials__divider" />
              <p className="hero-credentials__online">
                {LUDMILA_CONTENT.hero.onlineCallout}
              </p>
            </div>

            <div
              ref={heroPortraitCardRef}
              className="hero-portrait-composition"
            >
              <div className="hero-portrait-frame">
                <img
                  src={LUDMILA_CONTENT.assets.photoStanding}
                  alt="Ludmila Taquary — Psicóloga e Psicanalista"
                  className="hero-portrait-img"
                />
              </div>
              <span className="hero-portrait-tag">
                BRASÍLIA · ONLINE PARA TODO O BRASIL
              </span>
            </div>
          </div>
        </div>

        {/* Lower Stage: Monumental Name + Full-Width Thin Line + 3-Area Footer Bar */}
        <div className="hero-lower-stage">
          {/* Shared Monumental Title (Preloader Center -> Hero Full-Width -> Scroll Split) */}
          <div ref={titleWrapperRef} className="hero-title-wrapper">
            <h1 className="hero-monumental-title">
              <span
                ref={wordLudmilaRef}
                className="hero-title-word hero-title-word--sans"
              >
                {LUDMILA_CONTENT.name.first}
              </span>
              <span
                ref={wordTaquaryRef}
                className="hero-title-word hero-title-word--serif"
              >
                {LUDMILA_CONTENT.name.last}
              </span>
            </h1>
          </div>

          {/* Thin, delicate horizontal line spanning the full width */}
          <div
            ref={bottomDividerRef}
            className="hero-full-divider"
            aria-hidden="true"
          />

          {/* Three areas below the line: Left (Logo/ID), Center (Online info + Scroll arrow), Right (Nav + WhatsApp CTA) */}
          <div ref={bottomBarRef} className="hero-bottom-bar">
            {/* Area 1: Left — Original Logo & Professional Identification */}
            <div className="hero-bottom-col hero-bottom-col--left">
              <img
                src={LUDMILA_CONTENT.assets.logoTransparent}
                alt="Logotipo Ludmila Taquary — Psicóloga CRP 01/30289 | Psicanalista Lacaniana"
                className="hero-brand-logo"
              />
              <div className="hero-bottom-id">
                <span className="hero-bottom-id__primary">
                  Psicóloga | Psicanalista
                </span>
                <span className="hero-bottom-id__secondary">
                  {LUDMILA_CONTENT.credentials.crp}
                </span>
              </div>
            </div>

            {/* Area 2: Center — Online Attendance Info & Subtle Scroll Arrow */}
            <div className="hero-bottom-col hero-bottom-col--center">
              <span className="hero-bottom-online-text">
                {LUDMILA_CONTENT.hero.onlineCallout}
              </span>
              <button
                type="button"
                onClick={onNavigateAbout}
                className="hero-scroll-cue"
                aria-label="Rolar para a seção Sobre"
              >
                <span className="hero-scroll-cue__label">Explorar</span>
                <span className="hero-scroll-cue__icon">
                  <ArrowDown size={14} strokeWidth={1.5} />
                </span>
              </button>
            </div>

            {/* Area 3: Right — Navigation Links & Discrete WhatsApp CTA */}
            <nav
              className="hero-bottom-col hero-bottom-col--right"
              aria-label="Navegação principal e contato"
            >
              <a
                href="#inicio"
                onClick={(e) => {
                  if (onNavigateSection) {
                    e.preventDefault();
                    onNavigateSection('#inicio');
                  }
                }}
                className="hero-nav-link"
              >
                Início
              </a>
              <a
                href="#sobre"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateAbout();
                }}
                className="hero-nav-link"
              >
                Sobre
              </a>
              <a
                href="#servicos"
                onClick={(e) => {
                  if (onNavigateSection) {
                    e.preventDefault();
                    onNavigateSection('#servicos');
                  }
                }}
                className="hero-nav-link"
              >
                Serviços
              </a>
              <a
                href="#palestras"
                onClick={(e) => {
                  if (onNavigateSection) {
                    e.preventDefault();
                    onNavigateSection('#palestras');
                  }
                }}
                className="hero-nav-link"
              >
                Palestras
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  if (onNavigateSection) {
                    e.preventDefault();
                    onNavigateSection('#faq');
                  }
                }}
                className="hero-nav-link"
              >
                Dúvidas
              </a>
              <a
                href={LUDMILA_CONTENT.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-whatsapp-cta"
              >
                <span>Agendar conversa</span>
                <ArrowUpRight size={14} strokeWidth={1.6} />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};
