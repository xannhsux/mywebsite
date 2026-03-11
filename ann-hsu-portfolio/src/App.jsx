import { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import LandingPage from './components/ui/LandingPage';
import Experience from './components/3d/Experience';
import AboutPlaceholder from './components/ui/AboutPlaceholder';

// ── Project detail data (matches IDs in Experience) ──
const PROJECT_DETAILS = {
    0: { category: 'SYSTEMS', title: 'Aero Logic', desc: 'A distributed flight control system built with Rust and real-time telemetry. Handles concurrent sensor data streams with sub-millisecond latency.', tech: ['Rust', 'gRPC', 'Redis', 'Docker'] },
    1: { category: 'DATA SCIENCE', title: 'Cipher Core', desc: 'End-to-end encrypted data pipeline for sensitive financial analytics. Features zero-knowledge proofs and homomorphic encryption.', tech: ['Python', 'PySpark', 'AWS', 'Crypto'] },
    2: { category: 'DESIGN SYSTEM', title: 'Genesis ML', desc: 'A machine learning framework with visual model builder. Drag-and-drop neural network architecture design with real-time training visualization.', tech: ['PyTorch', 'React', 'D3.js', 'WebGL'] },
    3: { category: 'AI LAB', title: 'Vision Lab', desc: 'Computer vision platform for real-time object detection and scene understanding. Processes 60fps video feeds with custom YOLO variants.', tech: ['OpenCV', 'TensorRT', 'CUDA', 'FastAPI'] },
    4: { category: 'SYSTEMS', title: 'Neural Flow', desc: 'Interactive 3D neural network visualizer. Explore model architectures, watch activations propagate, and debug training in real time.', tech: ['Three.js', 'TensorFlow.js', 'WebGL'] },
    5: { category: 'DATA SCIENCE', title: 'Aether UI', desc: 'Open-source design system with 40+ accessible components. Features glassmorphism, fluid animations, and full dark mode support.', tech: ['React', 'Storybook', 'CSS', 'A11y'] },
};

function getProjectDetail(id) {
    const key = id % 6;
    return PROJECT_DETAILS[key] || PROJECT_DETAILS[0];
}

export default function App() {
    const [stage, setStage] = useState('landing');
    const [selectedProject, setSelectedProject] = useState(null);
    const sceneContainerRef = useRef();

    const handleTransitionToAbout = useCallback(() => {
        setStage('about');
    }, []);

    useEffect(() => {
        if (stage === 'journey' && sceneContainerRef.current) {
            sceneContainerRef.current.style.opacity = '1';
            sceneContainerRef.current.style.transform = 'none';
        }
    }, [stage]);

    const detail = selectedProject !== null ? getProjectDetail(selectedProject) : null;

    return (
        <main className="fixed inset-0 w-full h-full bg-[#FFFFFF] select-none overflow-hidden font-sans">
            {/* ── 3D Scene ── */}
            <div
                ref={sceneContainerRef}
                className={`absolute inset-0 z-0 transition-all duration-700 ${stage === 'landing'
                    ? 'blur-2xl scale-105 opacity-30'
                    : 'opacity-100'
                    }`}
            >
                <Canvas
                    camera={{
                        position: [0, 0, 0.1],
                        fov: 78, near: 0.1, far: 200,
                    }}
                    style={{ touchAction: 'none', width: '100%', height: '100%' }}
                    gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
                    dpr={[1, 2]}
                >
                    <color attach="background" args={['#FFFFFF']} />
                    <Suspense fallback={null}>
                        <Experience
                            stage={stage}
                            selectedProject={selectedProject}
                            onSelect={setSelectedProject}
                            onTransitionToAbout={handleTransitionToAbout}
                        />
                    </Suspense>
                </Canvas>
            </div>

            {/* ── Landing / About overlays ── */}
            <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                <AnimatePresence mode="wait">
                    {stage === 'landing' && (
                        <LandingPage key="land" onEnter={() => setStage('journey')} />
                    )}
                    {stage === 'about' && (
                        <AboutPlaceholder key="about" onBack={() => setStage('journey')} />
                    )}
                </AnimatePresence>
            </div>

            {/* ── Project detail card (centered HTML overlay) ── */}
            <AnimatePresence>
                {detail && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[3px]"
                            onClick={() => setSelectedProject(null)}
                        />

                        {/* Card */}
                        <motion.div
                            key="detail-card"
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        >
                            <div
                                className="
                                    pointer-events-auto
                                    w-[420px] max-w-[90vw]
                                    bg-white
                                    rounded-2xl
                                    border border-gray-100
                                    shadow-[0_20px_80px_rgba(0,0,0,0.12)]
                                    p-10
                                    cursor-default
                                "
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Category */}
                                <div
                                    className="text-[10px] tracking-[0.3em] font-bold uppercase text-[#002147] opacity-40 mb-4"
                                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                >
                                    {detail.category}
                                </div>

                                {/* Title */}
                                <h2 className="text-2xl font-black text-[#000] tracking-tight mb-4 leading-tight">
                                    {detail.title}
                                </h2>

                                {/* Description */}
                                <p className="text-sm leading-relaxed text-gray-500 mb-6">
                                    {detail.desc}
                                </p>

                                {/* Tech pills */}
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {detail.tech.map((t) => (
                                        <span
                                            key={t}
                                            className="
                                                text-[10px] tracking-wider font-medium uppercase
                                                px-3 py-1.5 rounded-full
                                                bg-[#002147]/5 text-[#002147]/60
                                                border border-[#002147]/8
                                            "
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                {/* Close */}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="
                                        text-[10px] tracking-[0.3em] uppercase font-bold
                                        text-gray-400 hover:text-[#002147]
                                        transition-colors duration-200
                                    "
                                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                >
                                    ← Close
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Bottom "About Ann" tab ── */}
            {stage === 'journey' && selectedProject === null && (
                <motion.div
                    initial={{ y: 40 }}
                    animate={{ y: 0 }}
                    exit={{ y: 60 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200, delay: 0.3 }}
                    onClick={() => setStage('about')}
                    className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-auto cursor-pointer group"
                >
                    <div
                        className="
                            w-[70vw] pt-3 pb-5
                            bg-white
                            border border-b-0 border-gray-200
                            rounded-t-2xl
                            shadow-[0_-4px_20px_rgba(0,0,0,0.06)]
                            transition-all duration-300
                            group-hover:-translate-y-1
                            group-hover:shadow-[0_-6px_28px_rgba(0,0,0,0.1)]
                            text-center
                        "
                    >
                        <span
                            className="
                                text-[11px] tracking-[0.35em] font-bold uppercase
                                text-[#002147] opacity-50
                                group-hover:opacity-80
                                transition-opacity duration-300
                            "
                            style={{ fontFamily: '"JetBrains Mono", monospace' }}
                        >
                            About Ann
                        </span>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
