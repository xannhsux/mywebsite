import Navigation from './components/Navigation';
import Hero from './components/Hero';
import FeaturedWorks from './components/FeaturedWorks';
import IntellectualTrajectory from './components/IntellectualTrajectory';
import VisitorActivity from './components/VisitorActivity';
import PortfolioFooter from './components/PortfolioFooter';
import './styles/global.css';

export default function App() {
  return (
    <div className="portfolio-app">
      <Navigation />
      <Hero />
      <FeaturedWorks />
      <IntellectualTrajectory />
      <VisitorActivity />
      <PortfolioFooter />
    </div>
  );
}
