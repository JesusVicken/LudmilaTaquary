import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { HeroExperience } from './components/HeroExperience';
import { AboutSection } from './components/AboutSection';
import { ScrollKeywordsMarquee } from './components/ScrollKeywordsMarquee';
import { ServicesSection } from './components/ServicesSection';
import { TalksSection } from './components/TalksSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { ProgressSidebar, SectionKey, SECTIONS } from './components/ProgressSidebar';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionKey>('01');
  const [scrollProgress, setScrollProgress] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderComplete(true);
  }, []);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    let lenis: Lenis | null = null;

    if (!prefersReducedMotion) {
      lenis = new Lenis({
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenisRef.current = lenis;

      lenis.on('scroll', ScrollTrigger.update);

      const updateLenis = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(updateLenis);
        lenis?.destroy();
        lenisRef.current = null;
      };
    }
  }, []);

  // Monitor continuous scroll progress and detect active section
  useEffect(() => {
    const updateScrollMetrics = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setScrollProgress(progress);

      // Section positions detection
      const sectionIds: { key: SectionKey; id: string }[] = [
        { key: '01', id: 'inicio' },
        { key: '02', id: 'sobre' },
        { key: '03', id: 'servicos' },
        { key: '04', id: 'palestras' },
        { key: '05', id: 'faq' },
        { key: '06', id: 'contato' },
      ];

      const threshold = window.innerHeight * 0.45;
      let currentSection: SectionKey = '01';

      for (const item of sectionIds) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= threshold) {
            currentSection = item.key;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', updateScrollMetrics, { passive: true });
    window.addEventListener('resize', updateScrollMetrics);
    updateScrollMetrics();

    return () => {
      window.removeEventListener('scroll', updateScrollMetrics);
      window.removeEventListener('resize', updateScrollMetrics);
    };
  }, [preloaderComplete]);

  const scrollToTarget = useCallback((targetSelector: string) => {
    if (targetSelector === '#inicio' || targetSelector === 'top') {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { duration: 1.3 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    const targetEl = document.querySelector(targetSelector) as HTMLElement | null;
    if (!targetEl) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(targetEl, {
        duration: 1.35,
        offset: -20,
      });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleNavigateBySectionKey = useCallback(
    (sectionKey: SectionKey) => {
      const found = SECTIONS.find((s) => s.key === sectionKey);
      if (found) {
        scrollToTarget(found.targetId);
      }
    },
    [scrollToTarget]
  );

  return (
    <div className="site-shell">
      <ProgressSidebar
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        visible={preloaderComplete}
        onNavigate={handleNavigateBySectionKey}
      />

      <FloatingWhatsApp visible={preloaderComplete} />

      <main className="site-main">
        <HeroExperience
          onPreloaderComplete={handlePreloaderComplete}
          onNavigateAbout={() => scrollToTarget('#sobre')}
          onNavigateSection={scrollToTarget}
        />
        <AboutSection />
        <ScrollKeywordsMarquee />
        <ServicesSection />
        <TalksSection />
        <FaqSection />
        <ContactSection
          onScrollToTop={() => scrollToTarget('#inicio')}
          onNavigate={scrollToTarget}
        />
      </main>
    </div>
  );
};

export default App;
