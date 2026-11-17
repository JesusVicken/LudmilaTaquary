import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown, MessageCircle, HelpCircle } from 'lucide-react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';

gsap.registerPlugin(ScrollTrigger);

export const FaqSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const accordionRef = useRef<HTMLDivElement | null>(null);
  const [openIndexes, setOpenIndexes] = useState<number[]>([0]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = accordionRef.current?.querySelectorAll('.faq-item');
      if (items && items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: accordionRef.current,
              start: 'top 85%',
            },
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  const toggleItem = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="faq-section"
      aria-label="Perguntas frequentes e dúvidas clínicas"
    >
      <div className="faq-container">
        {/* Section Header */}
        <div className="section-header-editorial">
          <div className="section-tag-pill">
            <span className="section-tag-pill__dot" />
            <span>{LUDMILA_CONTENT.faq.tag}</span>
          </div>

          <h2 className="section-headline-serif">
            {LUDMILA_CONTENT.faq.title}
          </h2>

          <p className="section-subheadline">
            {LUDMILA_CONTENT.faq.subtitle}
          </p>
        </div>

        {/* Accordion List */}
        <div ref={accordionRef} className="faq-accordion">
          {LUDMILA_CONTENT.faq.items.map((item, idx) => {
            const isOpen = openIndexes.includes(idx);

            return (
              <div
                key={idx}
                className={`faq-item ${isOpen ? 'is-open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-item__trigger"
                  onClick={() => toggleItem(idx)}
                  aria-expanded={isOpen}
                  id={`faq-trigger-${idx}`}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="faq-item__num">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <span className="faq-item__question">{item.question}</span>
                  <span
                    className={`faq-item__icon-wrap ${
                      isOpen ? 'is-rotated' : ''
                    }`}
                  >
                    <ChevronDown size={18} strokeWidth={1.8} />
                  </span>
                </button>

                <div
                  id={`faq-answer-${idx}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${idx}`}
                  className={`faq-item__content ${isOpen ? 'is-expanded' : ''}`}
                >
                  <div className="faq-item__answer-inner">
                    <p className="faq-item__answer-text">{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Still have questions card */}
        <div className="faq-footer-help">
          <div className="faq-footer-help__content">
            <div className="faq-footer-help__icon">
              <HelpCircle size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h4 className="faq-footer-help__title">
                Ficou com alguma outra dúvida sobre as sessões ou palestras?
              </h4>
              <p className="faq-footer-help__desc">
                Sinta-se à vontade para enviar uma mensagem diretamente no WhatsApp. A escuta começa no primeiro contato.
              </p>
            </div>
          </div>

          <a
            href={LUDMILA_CONTENT.contact.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="faq-footer-help__btn"
          >
            <MessageCircle size={16} strokeWidth={1.8} />
            <span>Falar no WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
};
