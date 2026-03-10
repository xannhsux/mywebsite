import { useState, Suspense, lazy } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import LandingPage from './components/ui/LandingPage';
import Experience from './components/3d/Experience';
import JourneyUI from './components/ui/JourneyUI';
import AboutPage from './components/ui/AboutPage';

export default function App() {
  const [stage, setStage] = useState('landing'); // 'landing' | 'journey' | 'about'

  return (
    <main className="relative w-full h-screen overflow-hidden bg-white select-none">
      {/* 3D WebGL Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 35 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Suspense fallback={null}>
            <Experience stage={stage} />
          </Suspense>
        </Canvas>
      </div>

      {/* HTML / UI Overlay Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          {stage === 'landing' && (
            <LandingPage key="landing" onEnter={() => setStage('journey')} />
          )}

          {stage === 'journey' && (
            <JourneyUI
              key="journey"
              onScrollToAbout={() => setStage('about')}
            />
          )}

          {stage === 'about' && (
            <AboutPage key="about" onBack={() => setStage('journey')} />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
