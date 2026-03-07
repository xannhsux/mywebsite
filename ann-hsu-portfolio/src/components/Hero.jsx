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
  const prefersReduced = usePrefersReducedMotion();

  // 1. Scroll tracking (MotionValue, doesn't trigger React rerender)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // 2. Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for premium feel
  const springConfig = { damping: 30, stiffness: 200, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const placeholders = useMemo(() => {
    return PHOTO_CONFIGS.map((cfg, i) => ({
      ...cfg,
      src: createPlaceholderDataURI(cfg.w, cfg.h, i),
      bobDelay: -(i * 0.7),
      parallaxFactor: 0.02 + (i % 3) * 0.01,
      fadeTranslateY: 30 + (i % 4) * 10,
    }));
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const handleMouseMove = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseX.set((e.clientX - cx) / cx);
      mouseY.set((e.clientY - cy) / cy);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReduced, mouseX, mouseY]);

  return (
    <section ref={sectionRef} className="hero" aria-label="Hero section">
      <div className="hero__inner">
        <div className="hero__photos" aria-hidden="true">
          {placeholders.map((photo, i) => (
            <HeroPhoto
              key={i}
              photo={photo}
              scrollYProgress={scrollYProgress}
              mouseX={smoothMouseX}
              mouseY={smoothMouseY}
              prefersReduced={prefersReduced}
            />
          ))}
        </div>

        <div className="hero__text">
          <h1 className="hero__title">ANN HSU</h1>
          <p className="hero__subtitle">in pursuit of better questions.</p>
        </div>
      </div>
    </section>
  );
}

function HeroPhoto({ photo, scrollYProgress, mouseX, mouseY, prefersReduced }) {
  // We use separate useTransform calls. 
  // Each one creates a NEW MotionValue that tracks the input MotionValue.
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, -photo.fadeTranslateY]);

  const pX = useTransform(mouseX, [-1, 1], [-photo.parallaxFactor * 120, photo.parallaxFactor * 120]);
  const pY = useTransform(mouseY, [-1, 1], [-photo.parallaxFactor * 120, photo.parallaxFactor * 120]);

  return (
    <motion.div
      className="hero__photo"
      style={{
        width: photo.w,
        height: photo.h,
        left: `calc(50% + ${photo.x}%)`,
        top: `calc(50% + ${photo.y}%)`,
        rotate: photo.rotation,
        opacity: prefersReduced ? 1 : opacity,
        x: '-50%', // Maintain centering
        y: '-50%',
      }}
    >
      {/* 
        Nested motion div for the combined movement. 
        This avoids complex transform math and is extremely performant.
      */}
      <motion.div
        style={{
          x: prefersReduced ? 0 : pX,
          y: prefersReduced ? 0 : pY,
          translateY: prefersReduced ? 0 : scrollY,
        }}
        className="hero__photo-wrapper"
      >
        <img
          src={photo.src}
          alt=""
          width={photo.w}
          height={photo.h}
          loading="eager"
          style={{ animationDelay: `${photo.bobDelay}s` }}
        />
      </motion.div>
    </motion.div>
  );
}
