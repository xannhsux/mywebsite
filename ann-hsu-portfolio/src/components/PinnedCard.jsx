import './PinnedCard.css';

/**
 * GitHub-style pinned repository card.
 * Thin border, language dot, star count, public tag.
 * Clicking opens project detail modal.
 */
export default function PinnedCard({ repo, onClick }) {
  return (
    <button
      className="pinned-card"
      onClick={onClick}
      aria-label={`View details for ${repo.name}`}
    >
      <div className="pinned-card__header">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-text-secondary)" aria-hidden="true">
          <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z"/>
        </svg>
        <span className="pinned-card__name">{repo.name}</span>
        {repo.isPublic && <span className="pinned-card__badge">Public</span>}
      </div>

      <p className="pinned-card__description">{repo.description}</p>

      <div className="pinned-card__footer">
        <span className="pinned-card__language">
          <span
            className="pinned-card__language-dot"
            style={{ backgroundColor: repo.languageColor }}
          />
          {repo.language}
        </span>
        <span className="pinned-card__stars">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-text-secondary)" aria-hidden="true">
            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
          </svg>
          {repo.stars}
        </span>
      </div>
    </button>
  );
}
