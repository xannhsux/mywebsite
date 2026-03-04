import { useEffect, useRef } from 'react';
import './ProjectModal.css';

/**
 * Project detail modal — opened when clicking a pinned card.
 * Shows README-like content: problem, approach, impact, tech stack, metrics.
 */
export default function ProjectModal({ project, onClose }) {
  const overlayRef = useRef(null);
  const closeRef = useRef(null);

  // Focus trap & escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';

    // Focus the close button on open
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const { name, description, language, detail } = project;

  return (
    <div
      className="modal-overlay"
      ref={overlayRef}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label={`Project details: ${name}`}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header__title">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-text-secondary)" aria-hidden="true">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z"/>
            </svg>
            <h2>{name}</h2>
            <span className="modal-header__badge">Public</span>
          </div>
          <button
            ref={closeRef}
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"/>
            </svg>
          </button>
        </div>

        <p className="modal-description">{description}</p>

        <div className="modal-section">
          <h3>Problem</h3>
          <p>{detail.problem}</p>
        </div>

        <div className="modal-section">
          <h3>Approach</h3>
          <p>{detail.approach}</p>
        </div>

        <div className="modal-section">
          <h3>Impact</h3>
          <p>{detail.impact}</p>
        </div>

        <div className="modal-section">
          <h3>Tech Stack</h3>
          <div className="modal-tags">
            {detail.techStack.map((tech) => (
              <span key={tech} className="modal-tag">{tech}</span>
            ))}
          </div>
        </div>

        <div className="modal-section">
          <h3>Key Metrics</h3>
          <ul className="modal-metrics">
            {detail.metrics.map((metric) => (
              <li key={metric}>{metric}</li>
            ))}
          </ul>
        </div>

        <div className="modal-footer">
          <span className="modal-language">
            <span className="modal-language-dot" style={{ backgroundColor: project.languageColor }} />
            {language}
          </span>
        </div>
      </div>
    </div>
  );
}
