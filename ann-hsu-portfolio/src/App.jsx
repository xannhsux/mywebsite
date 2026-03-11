import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from './components/ui/LandingPage';
import ThreeCanvas from './components/3d/ThreeCanvas';
import AboutPlaceholder from './components/ui/AboutPlaceholder';

export default function App() {
    const [stage, setStage] = useState('landing');
    const [selectedProject, setSelectedProject] = useState(null);

    const handleTransitionToAbout = useCallback(() => {
        setStage('about');
    }, []);

    const handleCardSelect = useCallback((project) => {
        setSelectedProject(project);
    }, []);

    return (
        <main className="fixed inset-0 w-full h-full bg-[#FFFFFF] select-none overflow-hidden font-sans">
            {/* ── Pure WebGL 3D Scene ── */}
            <ThreeCanvas
                stage={stage}
                onCardSelect={handleCardSelect}
                onScrollAbout={handleTransitionToAbout}
            />

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

            {/* ── Project detail overlay (shows on card hover) ── */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
                    >
                        <div
                            className="
                                w-[340px] max-w-[40vw]
                                bg-white/95 backdrop-blur-sm
                                rounded-2xl
                                border border-gray-100
                                shadow-[0_16px_60px_rgba(0,0,0,0.10)]
                                p-8
                            "
                        >
                            {/* Project Name */}
                            <h2 className="text-xl font-bold text-[#000] tracking-tight mb-3 leading-tight">
                                {selectedProject.title}
                            </h2>

                            {/* Description */}
                            <p className="text-[13px] leading-relaxed text-[#002147]/50 mb-5">
                                {selectedProject.desc}
                            </p>

                            {/* Key Achievement */}
                            <div className="mb-5">
                                <div
                                    className="text-[9px] tracking-[0.2em] font-semibold uppercase text-[#002147]/35 mb-2"
                                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                >
                                    Key Achievement
                                </div>
                                <p className="text-[13px] leading-relaxed font-medium text-[#002147]/75">
                                    {selectedProject.achievement}
                                </p>
                            </div>

                            {/* Tech Stack */}
                            <div>
                                <div
                                    className="text-[9px] tracking-[0.2em] font-semibold uppercase text-[#002147]/35 mb-3"
                                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                >
                                    Tech Stack
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProject.tech.map((t) => (
                                        <span
                                            key={t}
                                            className="
                                                text-[10px] tracking-wider font-medium uppercase
                                                px-3 py-1.5 rounded-full
                                                bg-[#002147]/5 text-[#002147]/55
                                                border border-[#002147]/8
                                            "
                                            style={{ fontFamily: '"JetBrains Mono", monospace' }}
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Bottom "About Ann" tab ── */}
            {stage === 'journey' && !selectedProject && (
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
