import { useRef, useEffect } from 'react';
import AirplaneSVG from '../assets/AirplaneSVG';
import './IntellectualTrajectory.css';

/**
 * Section B — INTELLECTUAL TRAJECTORY
 *
 * ARCHITECTURE:
 *   The section is tall (2400px) to provide scroll range.
 *   Inside, a sticky container (100vh) pins the visualization to the viewport.
 *   All animated elements live inside this pinned box.
 *
 * SCROLL BINDING (rAF, zero setState):
 *
 *   scrollTravel = sectionHeight - containerHeight  (usable scroll distance)
 *   progress     = clamp(-rect.top / scrollTravel, 0, 1)
 *
 *   Airplane Y   = progress × containerHeight × 0.8   [transform: translateY]
 *   Line scaleY  = progress                            [grows top → bottom]
 *   Node visible = progress >= node.threshold           [dot + label fade in]
 *   Branch grow  = clamp((progress - threshold) / 0.05) [stroke-dashoffset]
 *   "becoming."  = progress >= 0.98                     [fade in]
 *
 * WHY STICKY:
 *   Without sticky, the airplane is position:absolute inside a 2400px section.
 *   It moves 0.85 * 2400 = 2040px down while the section scrolls 2400px up.
 *   Net: the airplane drifts UPWARD out of view. The user never sees it move.
 *   Sticky pins the container to the viewport so the airplane stays visible.
 */

const MILESTONES = [
  { threshold: 0.12, label: '2001 · born in Taipei' },
  { threshold: 0.28, label: '2008 · 1st grade · Shanghai' },
  { threshold: 0.44, label: '2020 · high school graduated · Shanghai' },
  { threshold: 0.60, label: '2020 · BSc Computer Science · King\'s College London' },
  { threshold: 0.76, label: '2023 · SWE · Applied Materials · Shanghai' },
  { threshold: 0.92, label: '2024 · MS Data Science · USC · Los Angeles' },
];

const SECTION_HEIGHT = 2400;     // px — total scroll height (tune this to control pacing)
const TRAVEL_RATIO = 0.8;       // airplane uses 80% of the viewport height
const BRANCH_LENGTH = 60;       // px — horizontal branch line length
const BRANCH_ANIM_RANGE = 0.05; // progress window for branch growth (5%)

export default function IntellectualTrajectory() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const airplaneRef = useRef(null);
  const lineRef = useRef(null);
  const dottedRef = useRef(null);
  const becomingRef = useRef(null);

  const dotRefs = useRef([]);
  const branchRefs = useRef([]);
  const labelRefs = useRef([]);

  const rafId = useRef(null);
  const dimsRef = useRef({ sectionHeight: 0, containerHeight: 0, scrollTravel: 1 });

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    if (!section || !container) return;

    // Cache dimensions — only recalculated on resize, never during scroll
    const cacheDims = () => {
      const sh = section.offsetHeight;
      const ch = container.offsetHeight;
      dimsRef.current = {
        sectionHeight: sh,
        containerHeight: ch,
        // Usable scroll travel: section height minus the sticky container height.
        // This is how many px the user actually scrolls while the container is pinned.
        scrollTravel: Math.max(1, sh - ch),
      };
    };
    cacheDims();
    window.addEventListener('resize', cacheDims);

    // Scroll handler — direct DOM mutation, no React re-renders
    const update = () => {
      const { containerHeight, scrollTravel } = dimsRef.current;

      const rect = section.getBoundingClientRect();
      // Progress 0→1 over the usable scroll distance (not the full section height).
      // This ensures progress reaches 1 right as the sticky container unsticks.
      const progress = Math.max(0, Math.min(1, -rect.top / scrollTravel));

      // --- Airplane: translateY from top to 80% of viewport ---
      if (airplaneRef.current) {
        const y = progress * containerHeight * TRAVEL_RATIO;
        airplaneRef.current.style.transform =
          `translateX(-50%) translateY(${y}px)`;
      }

      // --- Vertical line: scaleY grows from top ---
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleY(${progress})`;
      }

      // --- Milestones ---
      MILESTONES.forEach((m, i) => {
        const dot = dotRefs.current[i];
        const branch = branchRefs.current[i];
        const label = labelRefs.current[i];
        if (!dot || !branch || !label) return;

        const triggered = progress >= m.threshold;
        const branchProg = Math.max(0, Math.min(1,
          (progress - m.threshold) / BRANCH_ANIM_RANGE
        ));

        // Dot: fade + scale (CSS transition: 200ms)
        dot.style.opacity = triggered ? '1' : '0';
        dot.style.transform = triggered ? 'scale(1)' : 'scale(0.5)';

        // Branch: stroke-dashoffset (scroll-driven, no CSS transition)
        branch.setAttribute('stroke-dashoffset',
          String(BRANCH_LENGTH * (1 - branchProg))
        );
        branch.style.opacity = triggered ? '1' : '0';

        // Label: fade + slide (CSS transition: 200ms)
        const side = i % 2 === 0 ? 'right' : 'left';
        if (triggered) {
          label.style.opacity = '1';
          label.style.transform = 'translateX(0)';
        } else {
          label.style.opacity = '0';
          label.style.transform =
            `translateX(${side === 'right' ? 15 : -15}px)`;
        }
      });

      // --- End state: dotted line + "becoming." ---
      const showEnd = progress >= 0.98;
      if (dottedRef.current) dottedRef.current.style.opacity = showEnd ? '1' : '0';
      if (becomingRef.current) becomingRef.current.style.opacity = showEnd ? '1' : '0';
    };

    const onScroll = () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial frame

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', cacheDims);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="sectionB"
      className="trajectory"
      aria-label="Intellectual trajectory"
      style={{ height: `${SECTION_HEIGHT}px` }}
    >
      {/* Sticky container: pinned to viewport while section scrolls behind it */}
      <div ref={containerRef} className="trajectory__sticky">
        {/* Vertical flight path line — grows via scaleY */}
        <div ref={lineRef} className="trajectory__line" aria-hidden="true" />

        {/* Dotted extension at bottom of path */}
        <div
          ref={dottedRef}
          className="trajectory__dotted"
          style={{ top: `${TRAVEL_RATIO * 100}%` }}
          aria-hidden="true"
        />

        {/* Airplane — transform: translateY bound to scroll, no transition */}
        <div
          ref={airplaneRef}
          id="airplane"
          className="trajectory__airplane"
          aria-hidden="true"
        >
          <AirplaneSVG />
        </div>

        {/* Milestone nodes — branch out from the vertical path */}
        {MILESTONES.map((m, i) => {
          const side = i % 2 === 0 ? 'right' : 'left';
          const topPct = m.threshold * TRAVEL_RATIO * 100;

          return (
            <div
              key={i}
              className={`trajectory__node trajectory__node--${side}`}
              style={{ top: `${topPct}%` }}
            >
              <div
                ref={(el) => { dotRefs.current[i] = el; }}
                className="trajectory__node-dot"
              />
              <svg
                className="trajectory__node-branch"
                width={BRANCH_LENGTH}
                height="2"
                aria-hidden="true"
              >
                <line
                  ref={(el) => { branchRefs.current[i] = el; }}
                  x1={side === 'right' ? 0 : BRANCH_LENGTH}
                  y1="1"
                  x2={side === 'right' ? BRANCH_LENGTH : 0}
                  y2="1"
                  stroke="var(--color-text-secondary)"
                  strokeWidth="1"
                  strokeDasharray={BRANCH_LENGTH}
                  strokeDashoffset={BRANCH_LENGTH}
                />
              </svg>
              <span
                ref={(el) => { labelRefs.current[i] = el; }}
                className="trajectory__node-label"
              >
                {m.label}
              </span>
            </div>
          );
        })}

        {/* "becoming." — revealed at the very end */}
        <div
          ref={becomingRef}
          className="trajectory__becoming"
          style={{ top: `${TRAVEL_RATIO * 100 + 4}%` }}
        >
          <span>becoming.</span>
        </div>
      </div>
    </section>
  );
}
