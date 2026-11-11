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
  const quoteBlockRef = useRef<HTMLDivElement | null>(null);
  const infoFooterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      if (photoImgRef.current) {
        gsap.set(photoImgRef.current, { filter: 'blur(0px)', scale: 1 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Photograph blur-to-sharp progressive discovery on scroll
      if (photoImgRef.current && photoWrapperRef.current) {
        gsap.fromTo(
          photoImgRef.current,
          {
            filter: 'blur(16px)',
            scale: 1.08,
          },
          {
            filter: 'blur(0px)',
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: photoWrapperRef.current,
              start: 'top 88%',
              end: 'center 46%',
              scrub: 0.75,
            },
          }
        );

        // Subtle vertical parallax on the editorial photo frame
        gsap.fromTo(
          photoWrapperRef.current,
          { y: 36 },
          {
            y: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: photoWrapperRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        );
      }

      // 2. Featured quote block reveal
      if (quoteBlockRef.current) {
        gsap.fromTo(
          quoteBlockRef.current,
          { opacity: 0, y: 38 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: quoteBlockRef.current,
              start: 'top 82%',
              end: 'top 45%',
              scrub: 0.6,
            },
          }
        );
      }

      // 3. INFO + arrow footer reveal
      if (infoFooterRef.current) {
        gsap.fromTo(
          infoFooterRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: infoFooterRef.current,
              start: 'top 92%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
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
              triggerStart="top 84%"
              triggerEnd="bottom 50%"
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
                <span className="about-photo-caption__num">FIG. 02</span>
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
              triggerStart="top 85%"
              triggerEnd="bottom 46%"
            />
          </div>
        </div>

        {/* ═══ PART 3: Featured Quote (Special Visual Treatment & Generous Negative Space) ═══ */}
        <div ref={quoteBlockRef} className="about-featured-quote-stage">
          <div className="about-featured-quote-logo-wrap">
            <img
              src={LUDMILA_CONTENT.assets.logoTransparent}
              alt="Logotipo Ludmila Taquary"
              className="about-original-logo"
            />
          </div>

          <blockquote className="about-featured-quote">
            <span className="about-featured-quote__mark" aria-hidden="true">
              “
            </span>
            {LUDMILA_CONTENT.about.featuredQuoteClean}
            <span className="about-featured-quote__mark" aria-hidden="true">
              ”
            </span>
          </blockquote>

          <p className="about-featured-quote__sub">
            Psicanálise de Orientação Lacaniana
          </p>
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
