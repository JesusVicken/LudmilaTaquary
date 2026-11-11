import React from 'react';

interface ProgressSidebarProps {
  activeSection: '01' | '02';
  scrollProgress: number; // 0 to 1
  visible: boolean;
  onNavigate: (section: '01' | '02') => void;
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  activeSection,
  scrollProgress,
  visible,
  onNavigate,
}) => {
  const isLightSurface = activeSection === '02';
  const clampedProgress = Math.min(Math.max(scrollProgress, 0), 1);

  return (
    <aside
      className={`progress-sidebar ${visible ? 'is-visible' : ''} ${
        isLightSurface ? 'is-dark-ink' : 'is-light-ink'
      }`}
      aria-label="Indicador de progresso da página"
    >
      <div className="progress-sidebar__inner">
        <button
          type="button"
          className={`progress-sidebar__step ${
            activeSection === '01' ? 'is-active' : ''
          }`}
          onClick={() => onNavigate('01')}
          aria-current={activeSection === '01' ? 'location' : undefined}
        >
          <span className="progress-sidebar__num">01</span>
          <span className="progress-sidebar__sep">—</span>
          <span className="progress-sidebar__label">INÍCIO</span>
        </button>

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
              {activeSection === '01' ? '01 — INÍCIO' : '02 — SOBRE'}
            </span>
          </div>
        </div>

        <button
          type="button"
          className={`progress-sidebar__step ${
            activeSection === '02' ? 'is-active' : ''
          }`}
          onClick={() => onNavigate('02')}
          aria-current={activeSection === '02' ? 'location' : undefined}
        >
          <span className="progress-sidebar__num">02</span>
          <span className="progress-sidebar__sep">—</span>
          <span className="progress-sidebar__label">SOBRE</span>
        </button>
      </div>
    </aside>
  );
};
