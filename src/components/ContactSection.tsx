import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  MessageCircle,
  Mail,
  Clock,
  Globe2,
  ArrowUpRight,
  ShieldCheck,
  ChevronUp,
} from 'lucide-react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';
import { OrganicShaderCanvas } from './OrganicShaderCanvas';

gsap.registerPlugin(ScrollTrigger);

interface ContactSectionProps {
  onScrollToTop: () => void;
  onNavigate: (sectionId: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  onScrollToTop,
  onNavigate,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll('.contact-channel-card');
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={sectionRef}
      id="contato"
      className="contact-section"
      aria-label="Informações de contato e agendamento"
    >
      {/* Living WebGL Organic Green Shader Background */}
      <OrganicShaderCanvas className="contact-shader-bg" seedOffset={56} />

      {/* Subtle atmospheric background of the clinical office */}
      <div
        className="contact-office-bg"
        style={{ backgroundImage: `url(${LUDMILA_CONTENT.assets.photoOffice})` }}
        aria-hidden="true"
      />

      <div className="contact-container">
        {/* Section Header */}
        <div className="section-header-editorial section-header-editorial--center">
          <div className="section-tag-pill section-tag-pill--light">
            <span className="section-tag-pill__dot" />
            <span>{LUDMILA_CONTENT.contact.tag}</span>
          </div>

          <h2 className="section-headline-serif contact-title">
            {LUDMILA_CONTENT.contact.title}
          </h2>

          <p className="section-subheadline contact-subtitle">
            {LUDMILA_CONTENT.contact.subtitle}
          </p>
        </div>

        {/* Channels Grid */}
        <div ref={cardsRef} className="contact-channels-grid">
          {/* Card 1: WhatsApp */}
          <a
            href={LUDMILA_CONTENT.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-channel-card contact-channel-card--primary"
          >
            <div className="contact-channel-card__icon-badge">
              <MessageCircle size={22} strokeWidth={1.6} />
            </div>
            <div className="contact-channel-card__content">
              <span className="contact-channel-card__label">ATENDIMENTO &amp; AGENDAMENTO</span>
              <h3 className="contact-channel-card__value">
                {LUDMILA_CONTENT.contact.whatsappNumber}
              </h3>
              <p className="contact-channel-card__desc">
                Clique para iniciar uma conversa no WhatsApp diretamente com a Ludmila.
              </p>
            </div>
            <span className="contact-channel-card__action">
              <span>Iniciar conversa</span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </span>
          </a>

          {/* Card 2: E-mail */}
          <a
            href={`mailto:${LUDMILA_CONTENT.contact.email}`}
            className="contact-channel-card"
          >
            <div className="contact-channel-card__icon-badge">
              <Mail size={22} strokeWidth={1.6} />
            </div>
            <div className="contact-channel-card__content">
              <span className="contact-channel-card__label">E-MAIL INSTITUCIONAL</span>
              <h3 className="contact-channel-card__value">
                {LUDMILA_CONTENT.contact.email}
              </h3>
              <p className="contact-channel-card__desc">
                Para convites de palestras, propostas corporativas ou dúvidas formais.
              </p>
            </div>
            <span className="contact-channel-card__action">
              <span>Enviar e-mail</span>
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </span>
          </a>

          {/* Card 3: Horários & Modalidade */}
          <div className="contact-channel-card contact-channel-card--info">
            <div className="contact-channel-card__icon-badge">
              <Clock size={22} strokeWidth={1.6} />
            </div>
            <div className="contact-channel-card__content">
              <span className="contact-channel-card__label">HORÁRIOS &amp; MODALIDADE</span>
              <h3 className="contact-channel-card__value">
                {LUDMILA_CONTENT.contact.schedule}
              </h3>
              <p className="contact-channel-card__desc">
                {LUDMILA_CONTENT.contact.location}
              </p>
            </div>
            <div className="contact-channel-card__badge-row">
              <span className="contact-badge-pill">
                <Globe2 size={13} />
                <span>Todo o Brasil e Exterior</span>
              </span>
              <span className="contact-badge-pill">
                <ShieldCheck size={13} />
                <span>Sigilo Profissional</span>
              </span>
            </div>
          </div>
        </div>

        {/* Brand Banner & Identity */}
        <div className="contact-identity-banner">
          <div className="contact-identity-banner__logo-wrap">
            <img
              src={LUDMILA_CONTENT.assets.logoTransparent}
              alt="Logotipo Ludmila Taquary"
              className="contact-identity-banner__logo"
            />
          </div>

          <div className="contact-identity-banner__text">
            <h4 className="contact-identity-banner__name">LUDMILA TAQUARY</h4>
            <p className="contact-identity-banner__details">
              Psicóloga ({LUDMILA_CONTENT.credentials.crp}) e Psicanalista de Orientação Lacaniana
              <br />
              Graduada pelo CEUB · Especialista pelo Instituto ESPE
            </p>
          </div>

          <button
            type="button"
            onClick={onScrollToTop}
            className="contact-back-to-top"
            aria-label="Voltar ao início do site"
          >
            <span>Voltar ao topo</span>
            <ChevronUp size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* Footer Editorial Bottom Bar */}
        <div className="contact-footer-bar">
          <p className="contact-footer-copyright">
            © {new Date().getFullYear()} Ludmila Taquary. Todos os direitos reservados.
          </p>

          <nav className="contact-footer-nav" aria-label="Navegação do rodapé">
            <button
              type="button"
              onClick={() => onNavigate('#inicio')}
              className="contact-footer-link"
            >
              Início
            </button>
            <button
              type="button"
              onClick={() => onNavigate('#sobre')}
              className="contact-footer-link"
            >
              Sobre
            </button>
            <button
              type="button"
              onClick={() => onNavigate('#servicos')}
              className="contact-footer-link"
            >
              Serviços
            </button>
            <button
              type="button"
              onClick={() => onNavigate('#palestras')}
              className="contact-footer-link"
            >
              Palestras
            </button>
            <button
              type="button"
              onClick={() => onNavigate('#faq')}
              className="contact-footer-link"
            >
              Dúvidas
            </button>
            <button
              type="button"
              onClick={() => onNavigate('#contato')}
              className="contact-footer-link"
            >
              Contato
            </button>
          </nav>

          <p className="contact-footer-ethics">
            Atendimento psicológico regulamentado pelo Conselho Federal de Psicologia (CFP).
          </p>
        </div>
      </div>
    </footer>
  );
};
