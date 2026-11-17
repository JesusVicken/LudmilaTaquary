import React from 'react';
import { LUDMILA_CONTENT } from '../data/ludmilaContent';

interface FloatingWhatsAppProps {
  visible?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  visible = true,
}) => {
  return (
    <aside
      className={`floating-whatsapp ${visible ? 'is-visible' : ''}`}
      aria-label="Contato direto via WhatsApp"
    >
      <a
        href={LUDMILA_CONTENT.contact.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp__link"
        aria-label="Iniciar conversa com Ludmila Taquary no WhatsApp"
      >
        <span className="floating-whatsapp__pulse" aria-hidden="true" />
        <span className="floating-whatsapp__pulse-ring" aria-hidden="true" />

        <div className="floating-whatsapp__icon-wrap" aria-hidden="true">
          <svg
            className="floating-whatsapp__svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            width="24"
            height="24"
          >
            <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.477-.15-.678.15-.201.3-.778.98-.954 1.181-.176.2-.352.225-.653.075-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.787-1.677-2.088-.176-.301-.019-.464.132-.614.135-.135.301-.352.452-.527.15-.175.201-.3.301-.502.101-.201.05-.376-.025-.526-.075-.15-.678-1.634-.929-2.238-.244-.588-.492-.508-.678-.517-.176-.009-.377-.01-.577-.01s-.527.075-.803.376c-.276.301-1.054 1.03-1.054 2.511 0 1.481 1.079 2.91 1.23 3.111.15.201 2.124 3.243 5.146 4.549.719.311 1.28.497 1.718.636.722.23 1.378.197 1.898.12.579-.086 1.782-.728 2.033-1.431.251-.703.251-1.305.176-1.431-.076-.126-.277-.201-.578-.351zM12.042 21.75c-1.776 0-3.518-.466-5.056-1.353l-.362-.211-3.754.985 1.002-3.66-.232-.37c-.974-1.55-1.488-3.344-1.488-5.187 0-5.38 4.378-9.757 9.763-9.757 2.607 0 5.057 1.015 6.899 2.859 1.841 1.843 2.855 4.295 2.854 6.903-.001 5.381-4.38 9.758-9.644 9.758zm7.986-16.643c-2.133-2.135-4.97-3.311-7.988-3.311-6.222 0-11.284 5.061-11.286 11.285 0 1.989.519 3.931 1.505 5.639l-1.6 5.845 5.981-1.569c1.649.899 3.504 1.373 5.398 1.373h.005c6.221 0 11.284-5.062 11.286-11.286.001-3.016-1.173-5.852-3.301-7.976z" />
          </svg>
        </div>

        <div className="floating-whatsapp__tooltip">
          <span className="floating-whatsapp__tooltip-title">
            Fale com a Ludmila
          </span>
          <span className="floating-whatsapp__tooltip-sub">
            Agendamentos &amp; Dúvidas
          </span>
        </div>
      </a>
    </aside>
  );
};
