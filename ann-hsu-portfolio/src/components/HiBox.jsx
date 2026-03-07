import { useState, useRef, useCallback } from 'react';
import './HiBox.css';

/**
 * HiBox — "Welcome to chat" interaction.
 *
 * User presses Enter in a single-line input to send a "hi".
 * Stores daily count in localStorage (key: "hi-counts").
 * Rate-limited: one hi per browser per day.
 *
 * Props:
 *   onHiSent — callback fired after a successful hi (receives dateKey)
 */

const STORAGE_KEY = 'hi-counts';
const SENT_TODAY_KEY = 'hi-sent-today';

/** Get today's date as YYYY-MM-DD */
function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

/** Check if user already sent a hi today */
function hasSentToday() {
  return localStorage.getItem(SENT_TODAY_KEY) === todayKey();
}

/** Read all hi counts from localStorage */
export function getHiCounts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

/** Increment today's hi count and mark as sent */
function recordHi() {
  const key = todayKey();
  const counts = getHiCounts();
  counts[key] = (counts[key] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  localStorage.setItem(SENT_TODAY_KEY, key);
  return key;
}

export default function HiBox({ onHiSent }) {
  const [value, setValue] = useState('');
  const [feedback, setFeedback] = useState(false);
  const [alreadySent, setAlreadySent] = useState(() => hasSentToday());
  const feedbackTimer = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();

    if (alreadySent) return;

    const dateKey = recordHi();
    setValue('');
    setAlreadySent(true);
    setFeedback(true);

    if (onHiSent) onHiSent(dateKey);

    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(false), 800);
  }, [alreadySent, onHiSent]);

  const placeholder = feedback
    ? 'thanks!'
    : alreadySent
      ? 'see you tomorrow!'
      : 'say hi';

  return (
    <div className="hi-box">
      <div className="hi-box__header">
        <h4 className="hi-box__title">Welcome to chat</h4>
        <p className="hi-box__subtitle">Say hi — press Enter to send.</p>
      </div>
      <input
        type="text"
        className={`hi-box__input${feedback ? ' hi-box__input--feedback' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={alreadySent && !feedback}
        aria-label="Send a hi"
        autoComplete="off"
      />
    </div>
  );
}
