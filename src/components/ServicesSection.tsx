import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, CheckCircle2, Sparkles, User, Users, HeartHandshake } from 'lucide-react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';
import { SplitScrollText } from './SplitScrollText';

gsap.registerPlugin(ScrollTrigger);

export const ServicesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);
  const lacanBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Cards reveal with subtle stagger
      const cards = cardsRef.current?.querySelectorAll('.service-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.18,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      // Lacanian focus block
      if (lacanBlockRef.current) {
        gsap.fromTo(
          lacanBlockRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1.0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: lacanBlockRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const getServiceIcon = (id: string) => {
    switch (id) {
      case 'adultos':
        return <User size={22} strokeWidth={1.5} />;
      case 'adolescentes':
        return <Users size={22} strokeWidth={1.5} />;
      case 'escuta-psicossocial':
        return <HeartHandshake size={22} strokeWidth={1.5} />;
      default:
        return <Sparkles size={22} strokeWidth={1.5} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="servicos"
      className="services-section"
      aria-label="Serviços clínicos de Ludmila Taquary"
    >
      <div className="services-container">
        {/* Section Header */}
        <div className="section-header-editorial">
          <div className="section-tag-pill">
            <span className="section-tag-pill__dot" />
            <span>{LUDMILA_CONTENT.services.tag}</span>
          </div>

          <h2 className="section-headline-serif">
            {LUDMILA_CONTENT.services.title}
          </h2>

          <p className="section-subheadline">
            {LUDMILA_CONTENT.services.subtitle}
          </p>
        </div>

        {/* 3 Main Service Cards */}
        <div ref={cardsRef} className="services-grid">
          {LUDMILA_CONTENT.services.cards.map((service) => (
            <article key={service.id} className="service-card">
              <div className="service-card__top">
                <span className="service-card__num">{service.num}</span>
                <span className="service-card__badge">{service.category}</span>
                <div className="service-card__icon">
                  {getServiceIcon(service.id)}
                </div>
              </div>

              <div className="service-card__body">
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.description}</p>

                <div className="service-card__divider" />

                <h4 className="service-card__list-title">Eixos de Escuta:</h4>
                <ul className="service-card__list">
                  {service.highlights.map((item, idx) => (
                    <li key={idx} className="service-card__list-item">
                      <CheckCircle2 size={14} className="service-card__bullet" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="service-card__footer">
                <a
                  href={`${LUDMILA_CONTENT.contact.whatsappUrl}&text=Ol%C3%A1%2C%20Ludmila!%20Gostaria%20de%20conversar%20sobre%20${encodeURIComponent(
                    service.title
                  )}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="service-card__cta"
                >
                  <span>Agendar primeira sessão</span>
                  <ArrowUpRight size={15} strokeWidth={1.8} />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Lacanian Clinical Concept Card */}
        <div ref={lacanBlockRef} className="lacanian-concept-card">
          <div className="lacanian-concept-card__left">
            <span className="lacanian-concept-card__badge">
              FUNDAMENTOS DA CLÍNICA
            </span>
            <blockquote className="lacanian-concept-card__quote">
              {LUDMILA_CONTENT.services.quote}
            </blockquote>
            <p className="lacanian-concept-card__author">
              Psicanálise Lacaniana · A Palavra e o Inconsciente
            </p>
          </div>

          <div className="lacanian-concept-card__right">
            <p className="lacanian-concept-card__text">
              {LUDMILA_CONTENT.services.lacanianConcept}
            </p>
            <div className="lacanian-concept-card__meta">
              <span className="lacanian-concept-card__dot" />
              <span>
                Atendimento 100% online para todo o Brasil e exterior com sigilo absoluto
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
