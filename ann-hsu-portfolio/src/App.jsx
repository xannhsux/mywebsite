import { useState, Suspense, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import LandingPage from './components/ui/LandingPage';
import Experience from './components/3d/Experience';
import AboutPlaceholder from './components/ui/AboutPlaceholder';

// ── Full project detail data (matches cycling IDs in Experience) ──
const PROJECT_DETAILS = [
    { category: 'AI · PRODUCT', title: 'Fashion AI', desc: 'AI-powered fashion app with competitive analysis and user validation. Built end-to-end from research to interactive prototype.', achievements: ['88% conversion — 44/50 signed up for early testing', 'Validated product-market fit through 3 rounds of user interviews', 'Designed and prototyped full user flow in Figma'], tech: ['Python', 'React', 'AI/ML', 'Figma'] },
    { category: 'AI · ML', title: 'Knowledge Retrieval', desc: 'Recommendation engine using vector embeddings and cosine similarity for large-scale unstructured data retrieval.', achievements: ['Low-latency retrieval across 100K+ document corpus', 'Built custom FAISS index with sub-100ms query time', 'Integrated with React frontend for real-time search'], tech: ['PyTorch', 'FAISS', 'React', 'Python'] },
    { category: 'DATA VIS', title: 'GeoData Vis', desc: 'Interactive visualization integrating heterogeneous datasets with geospatial context and synchronized 3D views.', achievements: ['Synchronized 3D views with real-time filtering', 'Processed and visualized 500K+ geospatial data points', 'Built custom WebGL rendering pipeline'], tech: ['Vue', 'Three.js', 'Node.js', 'REST'] },
    { category: 'DATA SCIENCE', title: 'Stock Portfolio', desc: 'Python + SQL analytics pipeline for real-world financial market data, featuring automated data ingestion and analysis.', achievements: ['Automated pipeline from Yahoo Finance API', 'Backtested strategies across 10 years of historical data', 'Generated automated reports with Pandas + Matplotlib'], tech: ['Python', 'SQL', 'Pandas'] },
    { category: 'FULL STACK', title: 'Travel + LLM', desc: 'Travel platform with LLM translating natural language to database queries across dual SQL/NoSQL architecture.', achievements: ['NL search across dual SQL/NoSQL databases', 'Deployed with Docker on cloud infrastructure', 'Built custom prompt engineering pipeline for query accuracy'], tech: ['React', 'Node.js', 'MySQL', 'MongoDB', 'OpenAI'] },
    { category: 'MOBILE', title: 'NFC Reader', desc: 'iOS/Android app for NFC-based product authenticity verification with cloud-backed validation.', achievements: ['>99% scan accuracy across 200+ tested products', 'Sub-second verification via AWS Lambda', 'Designed intuitive scan-and-verify UX flow'], tech: ['Swift', 'AWS Lambda', 'DynamoDB'] },
    { category: 'AI · ML', title: 'Medical Image AI', desc: 'Transfer learning fine-tuning VGG-16 for kidney CT classification with published research results.', achievements: ['98.96% accuracy — 30% improvement over baseline', 'Published in peer-reviewed conference', 'Built custom data augmentation pipeline for medical images'], tech: ['PyTorch', 'VGG-16', 'NumPy'] },
    { category: 'PRODUCT · UX', title: 'Emotional Relief', desc: 'AI emotional wellness app developed through product discovery, user research, and iterative design sprints.', achievements: ['85%+ willingness to pay from user testing', '100% recommendation intent from beta users', 'Conducted 5 design sprints with cross-functional team'], tech: ['Java', 'JavaScript', 'Figma'] },
];

function getProjectDetail(id) {
    return PROJECT_DETAILS[id % PROJECT_DETAILS.length];
}

// ── Tech icon mapping (devicons CDN) ──
const TECH_ICONS = {
    'Python': 'python/python-original',
    'React': 'react/react-original',
    'Figma': 'figma/figma-original',
    'PyTorch': 'pytorch/pytorch-original',
    'Vue': 'vuejs/vuejs-original',
    'Three.js': 'threejs/threejs-original',
    'Node.js': 'nodejs/nodejs-original',
    'SQL': 'mysql/mysql-original',
    'Pandas': 'pandas/pandas-original',
    'MySQL': 'mysql/mysql-original',
    'MongoDB': 'mongodb/mongodb-original',
    'Swift': 'swift/swift-original',
    'NumPy': 'numpy/numpy-original',
    'Java': 'java/java-original',
    'JavaScript': 'javascript/javascript-original',
};

function TechIcon({ name }) {
    const slug = TECH_ICONS[name];
    if (slug) {
        return (
            <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F5F7FA]">
                    <img
                        src={`https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${slug}.svg`}
                        alt={name}
                        className="w-6 h-6"
                    />
                </div>
                <span className="text-[9px] tracking-wide text-[#999] uppercase">{name}</span>
            </div>
        );
    }
    return (
        <div className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F5F7FA]">
                <span className="text-[10px] font-medium text-[#4A6FA5]">{name.slice(0, 3)}</span>
            </div>
            <span className="text-[9px] tracking-wide text-[#999] uppercase">{name}</span>
        </div>
    );
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

            {/* ── Project detail card (State B — expanded) ── */}
            <AnimatePresence>
                {detail && (
                    <>
                        {/* Click-outside dismiss (no dark overlay per spec) */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-40"
                            onClick={() => setSelectedProject(null)}
                        />

                        {/* Detail Card */}
                        <motion.div
                            key="detail-card"
                            initial={{ opacity: 0, scale: 0.8, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 30 }}
                            transition={{
                                type: 'spring',
                                damping: 22,
                                stiffness: 260,
                                mass: 0.8,
                            }}
                            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
                        >
                            <div
                                className="
                                    pointer-events-auto
                                    w-[480px] max-w-[92vw] max-h-[80vh]
                                    bg-white
                                    rounded-[32px]
                                    shadow-[0_20px_80px_rgba(0,0,0,0.12),0_8px_24px_rgba(0,0,0,0.06)]
                                    overflow-y-auto
                                    cursor-default
                                "
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header section */}
                                <div className="px-10 pt-10 pb-6">
                                    {/* Category */}
                                    <div
                                        className="text-[10px] tracking-[0.25em] font-medium uppercase text-[#4A6FA5] mb-3"
                                        style={{ fontFamily: '"DM Mono", "JetBrains Mono", monospace' }}
                                    >
                                        {detail.category}
                                    </div>

                                    {/* Title */}
                                    <h2
                                        className="text-[28px] font-bold text-[#4A6FA5] tracking-tight leading-tight mb-4"
                                        style={{ fontFamily: '"Syne", "Inter", sans-serif' }}
                                    >
                                        {detail.title}
                                    </h2>

                                    {/* Description */}
                                    <p
                                        className="text-[14px] leading-relaxed text-[#666] mb-0"
                                        style={{ fontFamily: '"Inter", sans-serif' }}
                                    >
                                        {detail.desc}
                                    </p>
                                </div>

                                {/* Divider */}
                                <div className="mx-10 h-px bg-[#F0F0F0]" />

                                {/* Achievements section */}
                                <div className="px-10 py-6">
                                    <h3
                                        className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#4A6FA5] mb-4"
                                        style={{ fontFamily: '"DM Mono", "JetBrains Mono", monospace' }}
                                    >
                                        Key Achievements
                                    </h3>
                                    <ul className="space-y-2.5">
                                        {detail.achievements.map((a, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#4A6FA5] mt-1.5 shrink-0" />
                                                <span
                                                    className="text-[13px] leading-relaxed text-[#444]"
                                                    style={{ fontFamily: '"Inter", sans-serif' }}
                                                >
                                                    {a}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Divider */}
                                <div className="mx-10 h-px bg-[#F0F0F0]" />

                                {/* Tech Stack grid */}
                                <div className="px-10 py-6">
                                    <h3
                                        className="text-[10px] tracking-[0.2em] font-medium uppercase text-[#4A6FA5] mb-4"
                                        style={{ fontFamily: '"DM Mono", "JetBrains Mono", monospace' }}
                                    >
                                        Tech Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {detail.tech.map((t) => (
                                            <TechIcon key={t} name={t} />
                                        ))}
                                    </div>
                                </div>

                                {/* Close button */}
                                <div className="px-10 pb-8 pt-2">
                                    <button
                                        onClick={() => setSelectedProject(null)}
                                        className="
                                            text-[10px] tracking-[0.25em] uppercase font-medium
                                            text-[#BBB] hover:text-[#4A6FA5]
                                            transition-colors duration-200
                                        "
                                        style={{ fontFamily: '"DM Mono", "JetBrains Mono", monospace' }}
                                    >
                                        ← Close
                                    </button>
                                </div>
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
                                text-black opacity-40
                                group-hover:opacity-70
                                transition-opacity duration-300
                            "
                            style={{ fontFamily: '"DM Mono", "JetBrains Mono", monospace' }}
                        >
                            About Ann
                        </span>
                    </div>
                </motion.div>
            )}
        </main>
    );
}
