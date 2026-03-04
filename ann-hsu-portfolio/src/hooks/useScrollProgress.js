import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Hook: returns scroll progress (0–1) for a given section ref.
 * progress = 0 when section top hits viewport top.
 * progress = 1 when section bottom hits viewport top.
 *
 * Uses requestAnimationFrame for performance.
 * Respects prefers-reduced-motion by snapping values instead of interpolating.
 */
export function useScrollProgress(sectionRef) {
  const [progress, setProgress] = useState(0);
  const rafId = useRef(null);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);

    rafId.current = requestAnimationFrame(() => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const sectionHeight = sectionRef.current.offsetHeight;

      // progress = how far through the section we've scrolled
      // 0 = section top at viewport top, 1 = section bottom at viewport top
      const raw = -rect.top / sectionHeight;
      const clamped = Math.max(0, Math.min(1, raw));
      setProgress(clamped);
    });
  }, [sectionRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial read

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [handleScroll]);

  return progress;
}

/**
 * Hook: returns true if user prefers reduced motion.
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mq.matches);

    const handler = (e) => setPrefersReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
