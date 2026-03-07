import { useRef, useEffect, useState, useMemo } from 'react';
import { useScrollProgress, usePrefersReducedMotion } from '../hooks/useScrollProgress';
import {
  createPlaceholderDataURI,
  PHOTO_CONFIGS,
} from '../utils/generatePlaceholders';
import './Hero.css';

/**
 * Section A — HERO
 *
 * Full-screen section with centered title "ANN HSU" and floating photos.
 *
 * Scroll behavior:
 *   Each photo's opacity = 1 - progress
 *   Each photo's translateY = -progress * (20–40px)
 *   Title remains fully visible (no fade on title).
 *   Photos are fully invisible (opacity 0) by the time Section B appears.
 *
 * Idle motion:
 *   Slow vertical bobbing (2–4px range) via CSS animation.
 *   Subtle parallax relative to cursor position.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const progress = useScrollProgress(sectionRef);
  const prefersReduced = usePrefersReducedMotion();
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Generate placeholder images on mount
  const placeholders = useMemo(() => {
    return PHOTO_CONFIGS.map((cfg, i) => ({
      ...cfg,
      src: createPlaceholderDataURI(cfg.w, cfg.h, i),
      bobDelay: -(i * 0.7), // staggered bobbing
      parallaxFactor: 0.02 + (i % 3) * 0.01, // subtle parallax multiplier
      fadeTranslateY: 20 + (i % 4) * 5, // 20–40px upward translate on scroll
    }));
  }, []);

  // Track cursor for parallax (throttled via state batching)
  useEffect(() => {
    if (prefersReduced) return;

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      setMouseOffset({
        x: (e.clientX - cx) / cx, // -1 to 1
        y: (e.clientY - cy) / cy,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced]);

  return (
    <section
      ref={sectionRef}
      className="hero"
      aria-label="Hero section"
    >
      <div className="hero__inner">
        {/* Floating photos */}
        <div className="hero__photos" aria-hidden="true">
          {placeholders.map((photo, i) => {
            // Scroll-driven: opacity fades from 1→0, translateY shifts upward
            const opacity = prefersReduced ? (progress > 0.5 ? 0 : 1) : 1 - progress;
            const scrollTranslateY = prefersReduced ? 0 : -progress * photo.fadeTranslateY;

            // Cursor parallax offsets
            const parallaxX = prefersReduced ? 0 : mouseOffset.x * photo.parallaxFactor * 100;
            const parallaxY = prefersReduced ? 0 : mouseOffset.y * photo.parallaxFactor * 100;

            return (
              <div
                key={i}
                className="hero__photo"
                style={{
                  width: photo.w,
                  height: photo.h,
                  left: `calc(50% + ${photo.x}%)`,
                  top: `calc(50% + ${photo.y}%)`,
                  transform: `
                    translate(-50%, -50%)
                    rotate(${photo.rotation}deg)
                    translateY(${scrollTranslateY}px)
                    translate(${parallaxX}px, ${parallaxY}px)
                  `,
                  opacity: Math.max(0, opacity),
                  animationDelay: `${photo.bobDelay}s`,
                }}
              >
                <img
                  src={photo.src}
                  alt=""
                  width={photo.w}
                  height={photo.h}
                  loading="eager"
                />
              </div>
            );
          })}
        </div>

        {/* Title — stays sharp; not affected by scroll fade */}
        <div className="hero__text">
          <h1 className="hero__title">ANN HSU</h1>
          <p className="hero__subtitle">in pursuit of better questions.</p>
        </div>
      </div>
    </section>
  );
}
