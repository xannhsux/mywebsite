/**
 * Paper-airplane SVG — realistic folded-paper look.
 *
 * Visual design:
 *   1. Outer contour — continuous closed path tracing the full silhouette
 *      (pointed nose → upper wing → tail notch → lower wing → back to nose).
 *      Slightly asymmetric wings for a natural, hand-folded feel.
 *   2. Center crease — thin line from nose to tail along the fold axis,
 *      giving the flat shape implied depth.
 *   3. Secondary fold — short line on the upper wing suggesting a second
 *      paper fold; adds realism without clutter.
 *   4. Underside fill — low-opacity triangle beneath the crease to hint
 *      at 3D volume / shadow between the two wing panels.
 *
 * Rotation:
 *   The base shape points RIGHT (nose at ~3 o'clock).
 *   • rotation={90}  → nose points DOWN  (used in the trajectory section)
 *   • rotation={0}   → nose points RIGHT
 *   • rotation={270} → nose points UP
 *
 * Animation-ready:
 *   className and style are forwarded so the parent container can apply
 *   transform: translate3d(...) for scroll-driven motion.
 *
 *   Optional micro-bounce on activation:
 *     .airplane--active { animation: airplane-pulse 300ms ease; }
 *     @keyframes airplane-pulse {
 *       50% { transform: scale(1.06); }
 *     }
 */
import React from "react";

export default function AirplaneSVG({
  size = 48,
  color = "#121212",
  rotation = 90,
  className = "",
  style = {},
  ...rest
}) {
  const svgStyle = {
    width: size,
    height: size,
    transform: `rotate(${rotation}deg)`,
    transformOrigin: "50% 50%",
    filter: "drop-shadow(0 4px 8px rgba(18,18,18,0.08))",
    willChange: "transform",
    ...style,
  };

  // Scale stroke to stay readable at small sizes (min 1.6 at 32px, 2.2 at 48px+)
  const sw = Math.max(1.6, Math.min(2.2, size / 22));
  const creaseSw = sw * 0.55;

  return (
    <svg
      className={className}
      style={svgStyle}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="paper airplane"
      {...rest}
    >
      {/*
        Outer contour — single closed path.
        Nose at (58,30), upper wing sweeps up-left, tail notch indents,
        lower wing sweeps down-left, closing back at nose.
        Upper wing is ~2px higher than lower for natural asymmetry.
      */}
      <path
        d="M58 30 L12 14 L22 29 L14 50 Z"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/*
        Center crease — nose to tail along the fold line.
        Slightly curved via the mid-anchor at (22,29) to feel organic.
      */}
      <path
        d="M58 30 L22 29 L8 32"
        stroke={color}
        strokeWidth={creaseSw}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.7"
      />

      {/*
        Secondary fold line on upper wing —
        short mark suggesting a second paper fold for realism.
      */}
      <path
        d="M36 22 L24 27"
        stroke={color}
        strokeWidth={creaseSw * 0.9}
        strokeLinecap="round"
        fill="none"
        opacity="0.35"
      />

      {/*
        Underside volume fill — low-opacity triangle between crease and
        lower wing, implying shadow / depth under the top panel.
      */}
      <path
        d="M58 30 L22 29 L14 50 Z"
        fill={color}
        opacity="0.07"
      />
    </svg>
  );
}
