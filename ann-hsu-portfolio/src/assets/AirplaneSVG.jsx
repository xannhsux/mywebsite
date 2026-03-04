/**
 * Minimal line-art airplane SVG.
 * Nose points downward (rotated 180° from standard upward-pointing airplane).
 */
export default function AirplaneSVG({ className, style }) {
  return (
    <svg
      className={className}
      style={style}
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Fuselage — nose points down */}
      <line x1="16" y1="4" x2="16" y2="28" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
      {/* Wings */}
      <line x1="16" y1="12" x2="6" y2="16" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="12" x2="26" y2="16" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
      {/* Tail */}
      <line x1="16" y1="4" x2="11" y2="7" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="16" y1="4" x2="21" y2="7" stroke="#121212" strokeWidth="1.2" strokeLinecap="round" />
      {/* Nose tip */}
      <circle cx="16" cy="28" r="1.2" fill="#121212" />
    </svg>
  );
}
