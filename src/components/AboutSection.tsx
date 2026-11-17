import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';
import { SplitScrollText } from './SplitScrollText';

gsap.registerPlugin(ScrollTrigger);

export const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const photoWrapperRef = useRef<HTMLDivElement | null>(null);
  const photoImgRef = useRef<HTMLImageElement | null>(null);
  const infoFooterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const photoWrap = photoWrapperRef.current;
    const photoImg = photoImgRef.current;
    if (!section || !photoWrap || !photoImg) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      photoImg.style.filter = 'blur(0px)';
      photoImg.style.transform = 'scale(1)';
      return;
    }

    const updatePhotoFocus = () => {
      const rect = photoWrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const startY = vh * 0.9;
      const endY = vh * 0.38;

      const rawProgress = (startY - rect.top) / Math.max(startY - endY, 1);
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const blurPx = (1 - progress) * 14;
      const scaleVal = 1.07 - progress * 0.07;

      photoImg.style.filter = `blur(${blurPx.toFixed(2)}px)`;
      photoImg.style.transform = `scale(${scaleVal.toFixed(3)})`;
    };

    updatePhotoFocus();

    const trigger = ScrollTrigger.create({
      onUpdate: updatePhotoFocus,
    });

    window.addEventListener('scroll', updatePhotoFocus, { passive: true });
    window.addEventListener('resize', updatePhotoFocus);

    return () => {
      trigger.kill();
      window.removeEventListener('scroll', updatePhotoFocus);
      window.removeEventListener('resize', updatePhotoFocus);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sobre"
      className="about-section"
      aria-label="Sobre Ludmila Taquary"
    >
      <div className="about-container">
        {/* Top editorial header line */}
        <div className="about-top-meta">
          <span className="about-section-index">02 — SOBRE</span>
          <span className="about-section-line" aria-hidden="true" />
          <span className="about-section-crp">
            LUDMILA TAQUARY · {LUDMILA_CONTENT.credentials.crp}
          </span>
        </div>

        {/* ═══ PART 1: Asymmetric Editorial Composition (Left Progressive Text + Right Blur-to-Sharp Photo) ═══ */}
        <div className="about-asymmetric-grid">
          <div className="about-left-column">
            <div className="about-tag-pill">
              <span className="about-tag-pill__dot" />
              <span>APRESENTAÇÃO</span>
            </div>

            <SplitScrollText
              as="h2"
              text={LUDMILA_CONTENT.about.highlightText}
              className="about-highlight-text"
              startRatio={0.86}
              endRatio={0.34}
            />

            <div className="about-subtle-notes">
              <div className="about-note-item">
                <span className="about-note-item__label">FORMAÇÃO</span>
                <span className="about-note-item__value">
                  Psicologia (CEUB) · Psicanálise (Instituto ESPE)
                </span>
              </div>
              <div className="about-note-item">
                <span className="about-note-item__label">MODALIDADE</span>
                <span className="about-note-item__value">
                  Adolescentes e adultos · Online para todo o Brasil
                </span>
              </div>
            </div>
          </div>

          <div className="about-right-column">
            <div ref={photoWrapperRef} className="about-photo-editorial-wrap">
              <div className="about-photo-frame">
                <img
                  ref={photoImgRef}
                  src={LUDMILA_CONTENT.assets.photoArmchair}
                  alt="Ludmila Taquary — Psicóloga e Psicanalista de orientação lacaniana"
                  className="about-photo-img"
                />
              </div>

              <div className="about-photo-caption">
                <span className="about-photo-caption__text">
                  Escuta clínica e singularidade — {LUDMILA_CONTENT.credentials.crp}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ PART 2: Main Text in Center of the Page (Larger Serif Editorial Typography) ═══ */}
        <div className="about-center-editorial">
          <div className="about-center-editorial__inner">
            <span className="about-center-editorial__eyebrow">
              PERCURSO CLÍNICO &amp; SOCIAL
            </span>

            <SplitScrollText
              as="p"
              text={LUDMILA_CONTENT.about.mainText}
              className="about-main-serif-text"
              startRatio={0.86}
              endRatio={0.34}
            />
          </div>
        </div>

        {/* ═══ PART 3: Featured Quote (Scroll-Linked Progressive Word Reveal like Reference Video) ═══ */}
        <div className="about-featured-quote-stage">
          <span className="about-featured-quote__top-mark" aria-hidden="true">
            “
          </span>

          <SplitScrollText
            as="blockquote"
            text={LUDMILA_CONTENT.about.featuredQuoteClean}
            className="about-featured-quote"
            startRatio={0.84}
            endRatio={0.35}
          />

          <p className="about-featured-quote__sub">
            PSICANÁLISE DE ORIENTAÇÃO LACANIANA
          </p>

          <div className="about-featured-quote-logo-wrap">
            <img
              src={LUDMILA_CONTENT.assets.logoTransparent}
              alt="Logotipo Ludmila Taquary"
              className="about-original-logo"
            />
          </div>
        </div>

        {/* ═══ PART 4: Bottom Identification 'INFO' + Arrow Indicating Navigation Continuity ═══ */}
        <div ref={infoFooterRef} className="about-info-continuation">
          <div className="about-info-divider" aria-hidden="true" />

          <div className="about-info-row">
            <div className="about-info-left">
              <span className="about-info-meta">
                {LUDMILA_CONTENT.hero.schedule} · {LUDMILA_CONTENT.hero.coverage}
              </span>
            </div>

            <div className="about-info-center">
              <span className="about-info-label">
                {LUDMILA_CONTENT.about.infoLabel}
              </span>
              <span className="about-info-arrow" aria-hidden="true">
                <ArrowDown size={15} strokeWidth={1.5} />
              </span>
            </div>

            <div className="about-info-right">
              <a
                href={LUDMILA_CONTENT.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="about-info-whatsapp"
              >
                <span>WhatsApp {LUDMILA_CONTENT.contact.whatsappNumber}</span>
                <ArrowUpRight size={14} strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
