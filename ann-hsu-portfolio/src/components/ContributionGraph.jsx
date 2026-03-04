import { useMemo } from 'react';
import './ContributionGraph.css';

/**
 * GitHub-style contribution graph (grayscale palette).
 * 52 weeks × 7 days grid with month labels.
 * Uses deterministic pseudo-random data for consistency.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const WEEKS = 52;
const CELL_SIZE = 11;
const CELL_GAP = 2;

// Grayscale contribution levels
const LEVELS = [
  'var(--color-gh-empty)',
  'var(--color-gh-l1)',
  'var(--color-gh-l2)',
  'var(--color-gh-l3)',
  'var(--color-gh-l4)',
];

/**
 * Deterministic pseudo-random number generator (mulberry32).
 * Ensures consistent graph across renders.
 */
function seededRandom(seed) {
  let t = seed + 0x6D2B79F5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export default function ContributionGraph() {
  const data = useMemo(() => {
    const grid = [];
    for (let week = 0; week < WEEKS; week++) {
      const col = [];
      for (let day = 0; day < 7; day++) {
        const r = seededRandom(week * 7 + day + 42);
        // Weight towards lower levels for realism
        let level;
        if (r < 0.35) level = 0;
        else if (r < 0.55) level = 1;
        else if (r < 0.72) level = 2;
        else if (r < 0.88) level = 3;
        else level = 4;
        col.push(level);
      }
      grid.push(col);
    }
    return grid;
  }, []);

  // Month labels positioned at approximate week boundaries
  const monthLabels = useMemo(() => {
    const labels = [];
    const weeksPerMonth = WEEKS / 12;
    for (let m = 0; m < 12; m++) {
      labels.push({
        label: MONTHS[m],
        x: Math.round(m * weeksPerMonth) * (CELL_SIZE + CELL_GAP) + 28,
      });
    }
    return labels;
  }, []);

  return (
    <div className="contrib-graph" role="img" aria-label="Contribution graph showing activity over the past year">
      <div className="contrib-graph__scroll">
        <svg
          width={WEEKS * (CELL_SIZE + CELL_GAP) + 32}
          height={7 * (CELL_SIZE + CELL_GAP) + 24}
          className="contrib-graph__svg"
        >
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={m.x}
              y={10}
              className="contrib-graph__month"
              fill="var(--color-text-secondary)"
              fontSize="10"
              fontFamily="var(--font-sans)"
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {DAYS.map((d, i) => (
            d && (
              <text
                key={i}
                x={0}
                y={20 + i * (CELL_SIZE + CELL_GAP) + CELL_SIZE - 2}
                className="contrib-graph__day"
                fill="var(--color-text-secondary)"
                fontSize="9"
                fontFamily="var(--font-sans)"
              >
                {d}
              </text>
            )
          ))}

          {/* Cells */}
          {data.map((week, wi) =>
            week.map((level, di) => (
              <rect
                key={`${wi}-${di}`}
                x={wi * (CELL_SIZE + CELL_GAP) + 28}
                y={di * (CELL_SIZE + CELL_GAP) + 16}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx="2"
                ry="2"
                fill={LEVELS[level]}
                className="contrib-graph__cell"
              >
                <title>{`Week ${wi + 1}, Day ${di + 1}: Level ${level}`}</title>
              </rect>
            ))
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="contrib-graph__legend">
        <span className="contrib-graph__legend-label">Less</span>
        {LEVELS.map((color, i) => (
          <div
            key={i}
            className="contrib-graph__legend-cell"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="contrib-graph__legend-label">More</span>
      </div>
    </div>
  );
}
