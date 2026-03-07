import { useState, useEffect, useMemo, useCallback } from 'react';
import './ContributionGraph.css';

/**
 * Contribution-style heatmap showing daily "hi" counts.
 * Reads from localStorage key "hi-counts" (JSON: { "YYYY-MM-DD": number }).
 * Listens for cross-tab storage events to update in real time.
 *
 * Props:
 *   refreshKey — increment to force re-read after a local hi
 */

const STORAGE_KEY = 'hi-counts';
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const WEEKS = 52;
const CELL_SIZE = 11;
const CELL_GAP = 2;

/* Color stops: empty → deep navy (uses CSS variables for theme consistency) */
const LEVEL_COLORS = [
  'var(--color-gh-empty)',    // 0 hi
  'var(--color-hi-l1)',       // 1 hi
  'var(--color-hi-l2)',       // 2–3
  'var(--color-hi-l3)',       // 4–6
  'var(--color-hi-l4)',       // 7+
];

function getLevel(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function readCounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Build 52×7 grid of { date: 'YYYY-MM-DD', count: number } */
function buildGrid(counts) {
  const today = new Date();
  const grid = [];

  // Find the start: go back 52 weeks from end-of-this-week
  const dayOfWeek = today.getDay(); // 0=Sun
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + (6 - dayOfWeek)); // Saturday of this week

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));

  const cursor = new Date(startDate);
  for (let week = 0; week < WEEKS; week++) {
    const col = [];
    for (let day = 0; day < 7; day++) {
      const key = cursor.toISOString().slice(0, 10);
      const isFuture = cursor > today;
      col.push({
        date: key,
        count: isFuture ? 0 : (counts[key] || 0),
        isFuture,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    grid.push(col);
  }
  return grid;
}

export default function ContributionGraph({ refreshKey = 0 }) {
  const [counts, setCounts] = useState(readCounts);

  // Re-read on refreshKey change (local hi) or storage event (cross-tab)
  const refresh = useCallback(() => setCounts(readCounts()), []);

  useEffect(() => { refresh(); }, [refreshKey, refresh]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refresh]);

  const grid = useMemo(() => buildGrid(counts), [counts]);

  // Total count
  const total = useMemo(
    () => Object.values(counts).reduce((s, n) => s + n, 0),
    [counts]
  );

  // Month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    grid.forEach((week, wi) => {
      const d = new Date(week[0].date);
      const m = d.getMonth();
      if (m !== lastMonth) {
        lastMonth = m;
        labels.push({
          label: MONTHS[m],
          x: wi * (CELL_SIZE + CELL_GAP) + 28,
        });
      }
    });
    return labels;
  }, [grid]);

  return (
    <div className="contrib-graph" role="img" aria-label={`Visitor hi heatmap: ${total} total`}>
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
          {grid.map((week, wi) =>
            week.map((cell, di) => {
              const level = getLevel(cell.count);
              return (
                <rect
                  key={`${wi}-${di}`}
                  x={wi * (CELL_SIZE + CELL_GAP) + 28}
                  y={di * (CELL_SIZE + CELL_GAP) + 16}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx="2"
                  ry="2"
                  fill={cell.isFuture ? 'transparent' : LEVEL_COLORS[level]}
                  className="contrib-graph__cell"
                >
                  <title>
                    {cell.isFuture
                      ? cell.date
                      : `${cell.date}: ${cell.count} hi${cell.count !== 1 ? 's' : ''}`}
                  </title>
                </rect>
              );
            })
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="contrib-graph__legend">
        <span className="contrib-graph__legend-label">Less</span>
        {LEVEL_COLORS.map((color, i) => (
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
