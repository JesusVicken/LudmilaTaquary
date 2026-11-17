import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Building2,
  GraduationCap,
  Trophy,
  Flame,
  ShieldCheck,
  MessageCircle,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';

gsap.registerPlugin(ScrollTrigger);

export const TalksSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(
    LUDMILA_CONTENT.talks.topics[0].id
  );

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.talk-item-card');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 82%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getTalkIcon = (id: string) => {
    switch (id) {
      case 'empresas-nr01':
        return <Building2 size={22} strokeWidth={1.5} />;
      case 'burnout-produtividade':
        return <Flame size={22} strokeWidth={1.5} />;
      case 'universidades':
        return <GraduationCap size={22} strokeWidth={1.5} />;
      case 'atletas-performance':
        return <Trophy size={22} strokeWidth={1.5} />;
      case 'violencia-genero':
        return <ShieldCheck size={22} strokeWidth={1.5} />;
      case 'pequenos-grupos':
        return <MessageCircle size={22} strokeWidth={1.5} />;
      default:
        return <Sparkles size={22} strokeWidth={1.5} />;
    }
  };

  return (
    <section
      ref={sectionRef}
      id="palestras"
      className="talks-section"
      aria-label="Palestras e intervenções em grupo por Ludmila Taquary"
    >
      <div className="talks-container">
        {/* Section Header */}
        <div className="section-header-editorial">
          <div className="section-tag-pill">
            <span className="section-tag-pill__dot" />
            <span>{LUDMILA_CONTENT.talks.tag}</span>
          </div>

          <h2 className="section-headline-serif">
            {LUDMILA_CONTENT.talks.title}
          </h2>

          <p className="section-subheadline">
            {LUDMILA_CONTENT.talks.subtitle}
          </p>

          <p className="talks-modalities-note">
            <span className="talks-modalities-dot" />
            {LUDMILA_CONTENT.talks.modalitiesNote}
          </p>
        </div>

        {/* Interactive Topic Grid */}
        <div ref={gridRef} className="talks-grid">
          {LUDMILA_CONTENT.talks.topics.map((topic) => {
            const isExpanded = expandedId === topic.id;

            return (
              <div
                key={topic.id}
                className={`talk-item-card ${isExpanded ? 'is-expanded' : ''}`}
                onClick={() => toggleExpand(topic.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(topic.id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                <div className="talk-item-card__header">
                  <div className="talk-item-card__icon-wrap">
                    {getTalkIcon(topic.id)}
                  </div>

                  <div className="talk-item-card__header-texts">
                    <span className="talk-item-card__category">
                      {topic.category}
                    </span>
                    <h3 className="talk-item-card__title">{topic.title}</h3>
                  </div>

                  <button
                    type="button"
                    className="talk-item-card__toggle-btn"
                    aria-label={isExpanded ? 'Recolher tema' : 'Expandir tema'}
                  >
                    <ChevronDown
                      size={18}
                      className={`talk-item-card__chevron ${
                        isExpanded ? 'is-rotated' : ''
                      }`}
                    />
                  </button>
                </div>

                <div
                  className={`talk-item-card__expandable ${
                    isExpanded ? 'is-open' : ''
                  }`}
                >
                  <p className="talk-item-card__description">
                    {topic.description}
                  </p>

                  <div className="talk-item-card__meta-row">
                    <div className="talk-item-card__target">
                      <span className="talk-item-card__target-label">
                        Público-alvo:
                      </span>
                      <span className="talk-item-card__target-value">
                        {topic.target}
                      </span>
                    </div>

                    <a
                      href={`${LUDMILA_CONTENT.contact.whatsappUrl}&text=Ol%C3%A1%2C%20Ludmila!%20Gostaria%20de%20solicitar%20uma%20proposta%20de%20palestra%20sobre%20${encodeURIComponent(
                        topic.title
                      )}.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="talk-item-card__cta"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span>Solicitar proposta</span>
                      <ArrowUpRight size={14} strokeWidth={1.8} />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Talk Banner */}
        <div className="talks-custom-card">
          <div className="talks-custom-card__left">
            <span className="talks-custom-card__badge">TEMA SOB MEDIDA</span>
            <h3 className="talks-custom-card__title">
              Precisa de um tema específico para sua organização, evento ou equipe?
            </h3>
            <p className="talks-custom-card__text">
              Desenvolvo intervenções e rodas de conversa customizadas de acordo com o diagnóstico, a cultura institucional e os desafios singulares do seu público.
            </p>
          </div>

          <div className="talks-custom-card__right">
            <a
              href={`${LUDMILA_CONTENT.contact.whatsappUrl}&text=Ol%C3%A1%2C%20Ludmila!%20Gostaria%20de%20conversar%20sobre%20uma%20palestra%20ou%20workshop%20personalizado%20para%20minha%20institui%C3%A7%C3%A3o.`}
              target="_blank"
              rel="noopener noreferrer"
              className="talks-custom-card__btn"
            >
              <span>Conversar com a Ludmila</span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
            <span className="talks-custom-card__schedule-info">
              Resposta ágil em horário comercial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
