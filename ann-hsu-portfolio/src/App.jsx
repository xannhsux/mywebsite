import { useState, Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import LandingPage from './components/ui/LandingPage';
import Experience from './components/3d/Experience';
import JourneyOverlay from './components/ui/JourneyOverlay';
import AboutPlaceholder from './components/ui/AboutPlaceholder';

export default function App() {
    const [stage, setStage] = useState('landing'); // 'landing' | 'journey' | 'about'

    return (
        <main className="relative w-full h-full bg-white select-none">
            {/* Layer 1: 3D Render Canvas (R3F) */}
            <div className="absolute inset-0 z-0 bg-white">
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 35 }}
                    gl={{
                        antialias: true,
                        stencil: false,
                        alpha: true,
                        powerPreference: "high-performance"
                    }}
                    dpr={[1, 2]} // Support high-resolution screens without overkill
                >
                    <Suspense fallback={null}>
                        <Experience stage={stage} />
                    </Suspense>
                </Canvas>
            </div>

            {/* Layer 2: Fixed Visual Anchors (HTML) */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
                {/* Navy Anchor Point (Stays static regardless of 3D rotation) */}
                {stage !== 'landing' && stage !== 'about' && (
                    <div className="w-48 h-48 rounded-full bg-navy pointer-events-none flex items-center justify-center shadow-2xl">
                        <span className="text-white text-3xl font-bold tracking-[0.2em] uppercase">Start</span>
                    </div>
                )}
            </div>

            {/* Layer 3: Interactive UI (HUD/Forms) */}
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
                <AnimatePresence mode="wait">
                    {stage === 'landing' && (
                        <LandingPage key="land" onEnter={() => setStage('journey')} />
                    )}

                    {stage === 'journey' && (
                        <JourneyOverlay
                            key="ui"
                            onEnterAbout={() => setStage('about')}
                        />
                    )}

                    {stage === 'about' && (
                        <AboutPlaceholder key="about" onBack={() => setStage('journey')} />
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
}
