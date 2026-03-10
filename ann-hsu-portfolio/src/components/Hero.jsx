import { useRef, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { usePrefersReducedMotion } from '../hooks/useScrollProgress';
import {
  createPlaceholderDataURI,
  PHOTO_CONFIGS,
} from '../utils/generatePlaceholders';
import './Hero.css';

/**
 * Section A — HERO
 *
 * Full-screen section with centered title "ANN HSU" and floating photos.
 * Refactored with Framer Motion for buttery-smooth 60fps animations.
 */
export default function Hero() {
  const sectionRef = useRef(null);

  return (
    <section ref={sectionRef} className="hero" aria-label="Hero section">
      <div className="hero__background">
        <img src="/hero-bg.png" alt="" aria-hidden="true" />
      </div>

      <div className="hero__inner">
        <div className="hero__content">
          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Ann Hsu
          </motion.h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            in pursuit of better questions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="#resume" className="hero__cta">
              Resume
            </a>
          </motion.div>
        </div>

        <div className="hero__scroll-indicator">
          [ SCROLL TO EXPLORE ]
        </div>
      </div>
    </section>
  );
}
