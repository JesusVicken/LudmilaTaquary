import React from 'react';

export type SectionKey = '01' | '02' | '03' | '04' | '05' | '06';

export interface SectionMeta {
  key: SectionKey;
  label: string;
  targetId: string;
}

export const SECTIONS: SectionMeta[] = [
  { key: '01', label: 'INÍCIO', targetId: '#inicio' },
  { key: '02', label: 'SOBRE', targetId: '#sobre' },
  { key: '03', label: 'SERVIÇOS', targetId: '#servicos' },
  { key: '04', label: 'PALESTRAS', targetId: '#palestras' },
  { key: '05', label: 'DÚVIDAS', targetId: '#faq' },
  { key: '06', label: 'CONTATO', targetId: '#contato' },
];

interface ProgressSidebarProps {
  activeSection: SectionKey;
  scrollProgress: number; // 0 to 1
  visible: boolean;
  onNavigate: (sectionKey: SectionKey) => void;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  activeSection,
  scrollProgress,
  visible,
  onNavigate,
}) => {
  // Dark background sections (need light ink): 01 (Hero) and 06 (Footer/Contact)
  // Light background sections (need dark ink): 02 (Sobre), 03 (Serviços), 04 (Palestras), 05 (FAQ)
  const isLightSurface =
    activeSection === '02' ||
    activeSection === '03' ||
    activeSection === '04' ||
    activeSection === '05';

  const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);
  const currentMeta =
    SECTIONS.find((s) => s.key === activeSection) || SECTIONS[0];

  return (
    <aside
      className={`progress-sidebar ${visible ? 'is-visible' : ''} ${
        isLightSurface ? 'is-dark-ink' : 'is-light-ink'
      }`}
      aria-label="Indicador de navegação e progresso da página"
    >
      <div className="progress-sidebar__inner">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.key;

          return (
            <button
              key={section.key}
              type="button"
              className={`progress-sidebar__step ${isActive ? 'is-active' : ''}`}
              onClick={() => onNavigate(section.key)}
              aria-current={isActive ? 'location' : undefined}
            >
              <span className="progress-sidebar__num">{section.key}</span>
              <span className="progress-sidebar__sep">—</span>
              <span className="progress-sidebar__label">{section.label}</span>
            </button>
          );
        })}

        <div className="progress-sidebar__track-wrap" aria-hidden="true">
          <div className="progress-sidebar__track">
            <div
              className="progress-sidebar__fill"
              style={{ transform: `scaleY(${clampedProgress})` }}
            />
            <div
              className="progress-sidebar__dot"
              style={{ top: `${clampedProgress * 100}%` }}
            />
          </div>

          <div
            className="progress-sidebar__floating-tag"
            style={{ top: `${clampedProgress * 100}%` }}
          >
            <span>
              {currentMeta.key} — {currentMeta.label}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
