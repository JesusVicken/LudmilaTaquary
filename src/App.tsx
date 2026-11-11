import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { HeroExperience } from './components/HeroExperience';
import { AboutSection } from './components/AboutSection';
import { ProgressSidebar } from './components/ProgressSidebar';

gsap.registerPlugin(ScrollTrigger);

export const App: React.FC = () => {
  const [preloaderComplete, setPreloaderComplete] = useState(false);
  const [activeSection, setActiveSection] = useState<'01' | '02'>('01');
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

  useEffect(() => {
    const updateScrollMetrics = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setScrollProgress(progress);

      const aboutEl = document.getElementById('sobre');
      if (aboutEl) {
        const rect = aboutEl.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.48) {
          setActiveSection('02');
        } else {
          setActiveSection('01');
        }
      }
    };

    window.addEventListener('scroll', updateScrollMetrics, { passive: true });
    window.addEventListener('resize', updateScrollMetrics);
    updateScrollMetrics();

    return () => {
      window.removeEventListener('scroll', updateScrollMetrics);
      window.removeEventListener('resize', updateScrollMetrics);
    };
  }, [preloaderComplete]);

  const handleNavigate = useCallback((section: '01' | '02') => {
    const targetId = section === '01' ? '#inicio' : '#sobre';
    const targetEl = document.querySelector(targetId) as HTMLElement | null;
    if (!targetEl) return;

    if (lenisRef.current) {
      lenisRef.current.scrollTo(section === '01' ? 0 : targetEl, {
        duration: 1.35,
      });
    } else {
      if (section === '01') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  return (
    <div className="site-shell">
      <ProgressSidebar
        activeSection={activeSection}
        scrollProgress={scrollProgress}
        visible={preloaderComplete}
        onNavigate={handleNavigate}
      />

      <main className="site-main">
        <HeroExperience
          onPreloaderComplete={handlePreloaderComplete}
          onNavigateAbout={() => handleNavigate('02')}
        />
        <AboutSection />
      </main>
    </div>
  );
};

export default App;
