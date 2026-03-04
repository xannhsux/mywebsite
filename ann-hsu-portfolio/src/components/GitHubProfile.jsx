import { useState } from 'react';
import ContributionGraph from './ContributionGraph';
import PinnedCard from './PinnedCard';
import ProjectModal from './ProjectModal';
import './GitHubProfile.css';

/**
 * Section C — GITHUB PROFILE
 *
 * Faithful recreation of GitHub desktop profile layout.
 * Left sidebar: avatar, name, bio, links.
 * Right main: pinned repos, contribution graph, activity, orgs.
 */

const PINNED_REPOS = [
  {
    name: 'portfolio-site',
    description: 'Personal portfolio with scroll-driven animations and interactive timeline.',
    language: 'TypeScript',
    languageColor: '#3178C6',
    stars: 12,
    isPublic: true,
    detail: {
      problem: 'Needed a portfolio that communicates both technical skill and design sensibility without relying on templates.',
      approach: 'Built from scratch with React + Framer Motion. Scroll-driven animations bound to viewport progress. GitHub-style contribution graph rendered with canvas.',
      impact: 'Deployed as primary portfolio. 2k+ unique visitors in first month.',
      techStack: ['React', 'Framer Motion', 'Vite', 'CSS Variables'],
      metrics: ['Lighthouse 98/100', '< 1s FCP', '0 layout shifts'],
    },
  },
  {
    name: 'systems-thinking-notes',
    description: 'A structured knowledge base on systems thinking, mental models, and decision frameworks.',
    language: 'MDX',
    languageColor: '#FCB32C',
    stars: 8,
    isPublic: true,
    detail: {
      problem: 'Scattered notes across tools made it hard to build connected mental models.',
      approach: 'Built an interconnected MDX-based knowledge graph with bidirectional linking and concept maps.',
      impact: 'Used daily for research and writing. Shared with 3 study groups.',
      techStack: ['Next.js', 'MDX', 'D3.js', 'Tailwind'],
      metrics: ['200+ linked notes', '45 concept maps'],
    },
  },
  {
    name: 'data-pipeline-kit',
    description: 'Lightweight ETL framework for academic research data processing.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 23,
    isPublic: true,
    detail: {
      problem: 'Research teams needed reproducible data pipelines without heavy infrastructure.',
      approach: 'Designed a decorator-based Python framework that chains transforms with built-in validation and lineage tracking.',
      impact: 'Adopted by 2 USC research labs. Reduced pipeline setup time by 60%.',
      techStack: ['Python', 'Pandas', 'SQLAlchemy', 'Pytest'],
      metrics: ['94% test coverage', '15 contributors'],
    },
  },
  {
    name: 'complexity-vis',
    description: 'Interactive visualizations of complex adaptive systems and emergent behavior.',
    language: 'JavaScript',
    languageColor: '#F1E05A',
    stars: 17,
    isPublic: true,
    detail: {
      problem: 'Complex systems concepts are hard to grasp without interactive exploration.',
      approach: 'Built browser-based simulations (cellular automata, agent-based models, network dynamics) with Canvas and WebGL.',
      impact: 'Featured in USC data science showcase. Used as teaching aid in 2 courses.',
      techStack: ['JavaScript', 'Canvas API', 'WebGL', 'D3.js'],
      metrics: ['6 simulations', '3k+ interactions'],
    },
  },
  {
    name: 'question-log',
    description: 'CLI tool for logging and categorizing questions that arise during work.',
    language: 'Rust',
    languageColor: '#DEA584',
    stars: 5,
    isPublic: true,
    detail: {
      problem: 'Good questions get lost in the flow of work. Wanted a frictionless capture tool.',
      approach: 'Rust CLI with SQLite backend. Supports tagging, search, and weekly digests. Integrates with shell hooks.',
      impact: 'Personal daily driver. Captures ~5 questions/day with full context.',
      techStack: ['Rust', 'SQLite', 'Clap', 'Serde'],
      metrics: ['< 10ms response', '1,200+ logged questions'],
    },
  },
  {
    name: 'api-health-monitor',
    description: 'Distributed health checker for microservice APIs with anomaly detection.',
    language: 'Go',
    languageColor: '#00ADD8',
    stars: 31,
    isPublic: true,
    detail: {
      problem: 'Needed lightweight, self-hosted API monitoring with smart alerting for a microservices architecture.',
      approach: 'Go service with configurable health checks, time-series storage, and statistical anomaly detection (z-score based).',
      impact: 'Deployed at Applied Materials for 12 internal services. Caught 3 production issues before user impact.',
      techStack: ['Go', 'InfluxDB', 'Docker', 'Grafana'],
      metrics: ['99.9% uptime', '< 200ms check latency', '12 services monitored'],
    },
  },
];

const ORGANIZATIONS = [
  { name: 'University of Southern California', abbr: 'USC', avatar: '#4E2A84' },
  { name: "King's College London", abbr: 'KCL', avatar: '#C41E3A' },
];

const RECENT_ACTIVITY = [
  { type: 'commit', repo: 'portfolio-site', message: 'refine scroll thresholds for trajectory section', time: '2 days ago' },
  { type: 'pr', repo: 'data-pipeline-kit', message: 'Add streaming transform support', time: '5 days ago' },
  { type: 'issue', repo: 'complexity-vis', message: 'Add Lorenz attractor visualization', time: '1 week ago' },
  { type: 'commit', repo: 'question-log', message: 'add weekly digest email export', time: '2 weeks ago' },
];

export default function GitHubProfile() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section className="gh-profile" aria-label="GitHub-style profile">
      <div className="gh-profile__layout">
        {/* ---- Left Sidebar ---- */}
        <aside className="gh-sidebar">
          <div className="gh-sidebar__avatar">
            <div className="gh-sidebar__avatar-circle" aria-label="Profile avatar">
              <span className="gh-sidebar__avatar-initials">AH</span>
            </div>
          </div>

          <div className="gh-sidebar__info">
            <h2 className="gh-sidebar__name">Ann Hsu</h2>
            <p className="gh-sidebar__username">annhsu</p>
            <p className="gh-sidebar__bio">thinking in systems.</p>
          </div>

          <button className="gh-sidebar__follow-btn">Follow</button>

          <div className="gh-sidebar__stats">
            <span><strong>42</strong> followers</span>
            <span>·</span>
            <span><strong>18</strong> following</span>
          </div>

          <ul className="gh-sidebar__links">
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/>
              </svg>
              Los Angeles, CA
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25zm-.025 5.42a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 1 1-2.83-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25z"/>
              </svg>
              <a href="#" className="gh-sidebar__link">annhsu.dev</a>
            </li>
            <li>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88l6.5-3.81Z"/>
              </svg>
              <a href="#" className="gh-sidebar__link">Resume (PDF)</a>
            </li>
          </ul>

          <div className="gh-sidebar__available">
            <span className="gh-sidebar__available-dot"></span>
            Available for hire
          </div>
        </aside>

        {/* ---- Main Content ---- */}
        <main className="gh-main">
          {/* Pinned Repositories */}
          <div className="gh-main__section">
            <h3 className="gh-main__section-title">
              Pinned
              <span className="gh-main__section-count">{PINNED_REPOS.length}</span>
            </h3>
            <div className="gh-pinned-grid">
              {PINNED_REPOS.map((repo) => (
                <PinnedCard
                  key={repo.name}
                  repo={repo}
                  onClick={() => setSelectedProject(repo)}
                />
              ))}
            </div>
          </div>

          {/* Contribution Graph */}
          <div className="gh-main__section">
            <h3 className="gh-main__section-title">
              365 contributions in the last year
            </h3>
            <ContributionGraph />
          </div>

          {/* Contribution Activity */}
          <div className="gh-main__section">
            <h3 className="gh-main__section-title">Contribution activity</h3>
            <div className="gh-activity">
              {RECENT_ACTIVITY.map((activity, i) => (
                <div key={i} className="gh-activity__item">
                  <div className="gh-activity__icon">
                    {activity.type === 'commit' && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-text-secondary)" aria-hidden="true">
                        <path d="M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.86 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.25a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z"/>
                      </svg>
                    )}
                    {activity.type === 'pr' && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-text-secondary)" aria-hidden="true">
                        <path d="M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z"/>
                      </svg>
                    )}
                    {activity.type === 'issue' && (
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="var(--color-text-secondary)" aria-hidden="true">
                        <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/><path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z"/>
                      </svg>
                    )}
                  </div>
                  <div className="gh-activity__content">
                    <span className="gh-activity__repo">{activity.repo}</span>
                    <span className="gh-activity__message">{activity.message}</span>
                    <span className="gh-activity__time">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Organizations */}
          <div className="gh-main__section">
            <h3 className="gh-main__section-title">Organizations</h3>
            <div className="gh-orgs">
              {ORGANIZATIONS.map((org) => (
                <div key={org.abbr} className="gh-orgs__item" title={org.name}>
                  <div
                    className="gh-orgs__avatar"
                    style={{ backgroundColor: org.avatar }}
                  >
                    <span>{org.abbr}</span>
                  </div>
                  <span className="gh-orgs__name">{org.name}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
