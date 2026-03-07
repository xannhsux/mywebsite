import { useState, useCallback } from 'react';
import ContributionGraph from './ContributionGraph';
import PinnedCard from './PinnedCard';
import ProjectModal from './ProjectModal';
import HiBox from './HiBox';
import './GitHubProfile.css';

/**
 * Section C — GITHUB PROFILE
 *
 * Layout:
 *   Left sidebar: avatar, name, bio, divider, organizations, links, available.
 *   Right main: pinned repos, hi-count heatmap, HiBox.
 */

const PINNED_REPOS = [
  {
    name: 'fashion-ai',
    description: 'AI-powered fashion application tackling unmet user needs through competitive analysis and user validation.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 44,
    isPublic: false,
    detail: {
      problem: 'Existing fashion tech products missed a critical user pain point identified through competitive analysis and user interviews.',
      approach: 'Conducted 50 user interviews to validate demand. Defined MVP scope, success metrics, and product roadmap balancing user value, technical feasibility, and iteration speed. Led end-to-end execution across design and engineering.',
      impact: '44 out of 50 interviewees signed up for early product testing, indicating strong product-market fit.',
      techStack: ['Python', 'React', 'AI/ML', 'Figma'],
      metrics: ['50 user interviews', '88% early sign-up rate', 'In active development'],
    },
  },
  {
    name: 'ai-knowledge-retrieval',
    description: 'Scalable recommendation engine using vector embeddings and cosine similarity for intelligent context retrieval.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 18,
    isPublic: true,
    detail: {
      problem: 'Users needed intelligent retrieval of relevant context from large-scale unstructured data with low latency.',
      approach: 'Architected a recommendation engine with PyTorch and FAISS using vector embeddings and cosine similarity for top-k retrieval. Optimized the ingestion pipeline for throughput. Built a full-stack feedback loop with React to capture relevance signals.',
      impact: 'Processes large-scale unstructured data into structured vector indices with low latency. Feedback loop enables future fine-tuning.',
      techStack: ['PyTorch', 'FAISS', 'React', 'Python'],
      metrics: ['Low-latency retrieval', 'Full-stack feedback loop', 'Scalable vector indexing'],
    },
  },
  {
    name: 'geodata-vis-platform',
    description: 'Interactive data visualization platform integrating structured datasets with geospatial context for decision support.',
    language: 'JavaScript',
    languageColor: '#F1E05A',
    stars: 14,
    isPublic: true,
    detail: {
      problem: 'Complex datasets with geospatial dimensions needed intuitive visualization to support data-driven decision making.',
      approach: 'Built a frontend dashboard with Vue and Three.js featuring synchronized 3D views and map-based interfaces. Developed a Node.js backend for preprocessing, aggregation, dynamic filtering, and real-time updates.',
      impact: 'Enables stakeholders to explore complex data through interactive 3D and map-based views with real-time filtering.',
      techStack: ['Vue', 'Three.js', 'Node.js', 'REST APIs'],
      metrics: ['3D synchronized views', 'Real-time filtering', 'Scalable workflows'],
    },
  },
  {
    name: 'stock-portfolio-system',
    description: 'Python and SQL analytics system for ingesting, cleaning, and analyzing real-world financial market data.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 9,
    isPublic: true,
    detail: {
      problem: 'Needed systematic analysis of portfolio performance, returns, and risk metrics from noisy real-world financial data.',
      approach: 'Built a pipeline to ingest and clean data from Yahoo Finance API, handling missing values, rate limits, and noisy time-series. Developed a normalized relational data model supporting systematic analysis across time.',
      impact: 'Enables reproducible analysis of portfolio performance, returns, and risk metrics with clean, structured data.',
      techStack: ['Python', 'SQL', 'Pandas', 'Yahoo Finance API'],
      metrics: ['Automated data ingestion', 'Normalized relational model', 'Risk metrics analysis'],
    },
  },
  {
    name: 'travel-analytics-llm',
    description: 'Travel data platform with LLM integration translating natural language queries into dynamic database calls.',
    language: 'JavaScript',
    languageColor: '#F1E05A',
    stars: 21,
    isPublic: true,
    detail: {
      problem: 'Trip planning required manual SQL queries across structured and unstructured data sources like reviews and itineraries.',
      approach: 'Engineered a dual-database architecture (MySQL + MongoDB). Integrated OpenAI and Hugging Face LLM APIs to translate natural language into dynamic database calls via RESTful APIs. Built a React UI with advanced search, auto-complete, and real-time results.',
      impact: 'Users can search travel data in natural language without writing SQL. Deployed with Docker for scalability.',
      techStack: ['React', 'Node.js', 'MySQL', 'MongoDB', 'OpenAI API', 'Docker'],
      metrics: ['Natural language search', 'Dual DB architecture', 'Dockerized deployment'],
    },
  },
  {
    name: 'nfc-reader-ios',
    description: 'Cross-platform mobile app enabling NFC chip scanning for real-time product authenticity verification.',
    language: 'Swift',
    languageColor: '#F05138',
    stars: 12,
    isPublic: true,
    detail: {
      problem: 'Consumers needed a reliable way to verify product authenticity in real time using NFC technology.',
      approach: 'Led a 3-member team to design and launch a cross-platform iOS/Android app. Implemented secure backend with AWS (API Gateway, DynamoDB, Lambda) ensuring encrypted data transfer.',
      impact: 'Delivered production-ready app in 4 months. >99% scan accuracy across 200+ tested products.',
      techStack: ['Swift', 'SwiftUI', 'AWS Lambda', 'DynamoDB', 'API Gateway'],
      metrics: ['>99% scan accuracy', '200+ products tested', '4-month delivery'],
    },
  },
  {
    name: 'medical-image-classification',
    description: 'Transfer learning study fine-tuning VGG-16 for kidney CT classification, with published findings.',
    language: 'Python',
    languageColor: '#3572A5',
    stars: 15,
    isPublic: true,
    detail: {
      problem: 'Needed to validate whether ImageNet pre-trained weights effectively transfer to medical imaging domains.',
      approach: 'Designed controlled experiments comparing fine-tuned VGG-16 with ImageNet weights against random initialization for kidney CT classification.',
      impact: 'Achieved 98.96% accuracy — a 30% improvement over baseline. Published findings on cross-domain transferability of ImageNet weights to medical imaging.',
      techStack: ['Python', 'PyTorch', 'VGG-16', 'NumPy', 'Matplotlib'],
      metrics: ['98.96% accuracy', '30% improvement over baseline', 'Published research'],
    },
  },
  {
    name: 'emotional-relief-ai',
    description: 'AI-based emotional wellness app built through end-to-end product discovery, user research, and iterative prototyping.',
    language: 'Java',
    languageColor: '#B07219',
    stars: 10,
    isPublic: true,
    detail: {
      problem: 'Existing emotional wellness apps lacked personalization, trust, and genuine support — gaps found by analyzing 5 leading apps.',
      approach: 'Conducted qualitative research with 27 participants including usability testing and in-depth interviews. Synthesized insights via empathy maps and personas. Built high-fidelity Figma prototypes and a functional prototype in Java and JavaScript.',
      impact: '85%+ willingness to pay via subscription. 100% recommendation intent. Validated through multi-round blind usability testing.',
      techStack: ['Java', 'JavaScript', 'Figma', 'User Research'],
      metrics: ['27 research participants', '85%+ willingness to pay', '100% recommendation intent'],
    },
  },
];

const ORGANIZATIONS = [
  { name: 'University of Southern California', abbr: 'USC', avatar: '#4E2A84' },
  { name: "King's College London", abbr: 'KCL', avatar: '#C41E3A' },
];

export default function GitHubProfile() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hiRefreshKey, setHiRefreshKey] = useState(0);

  const handleHiSent = useCallback(() => {
    setHiRefreshKey((k) => k + 1);
  }, []);

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
            <p className="gh-sidebar__bio">thinking in systems.</p>
          </div>

          {/* Divider */}
          <hr className="gh-sidebar__divider" />

          {/* Organizations — moved to sidebar */}
          <div className="gh-sidebar__orgs">
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

          {/* Hi-count Contribution Heatmap */}
          <div className="gh-main__section">
            <h3 className="gh-main__section-title">
              Visitor hi&apos;s in the last year
            </h3>
            <ContributionGraph refreshKey={hiRefreshKey} />
          </div>

          {/* HiBox */}
          <div className="gh-main__section">
            <HiBox onHiSent={handleHiSent} />
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
