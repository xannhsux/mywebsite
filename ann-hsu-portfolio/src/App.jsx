import Hero from './components/Hero';
import IntellectualTrajectory from './components/IntellectualTrajectory';
import GitHubProfile from './components/GitHubProfile';
import './styles/global.css';

/**
 * Main App — 3-section portfolio for Ann Hsu.
 *
 * Section A: Hero (100vh, floating photos, scroll fade)
 * Section B: Intellectual Trajectory (airplane flight path)
 * Section C: GitHub Profile (faithful GitHub layout replica)
 */
export default function App() {
  return (
    <>
      <Hero />
      <IntellectualTrajectory />
      <GitHubProfile />
    </>
  );
}
