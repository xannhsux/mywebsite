import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProjectCard from './ProjectCard';
import InfinityAnchor from './InfinityAnchor';

// ── Real project data ──
const PROJECT_DATA = [
    { title: 'Fashion AI', category: 'AI · PRODUCT', desc: 'AI-powered fashion app with competitive analysis and user validation.', achievement: '88% conversion — 44/50 signed up for early testing.', tech: ['Python', 'React', 'AI/ML', 'Figma'] },
    { title: 'Knowledge Retrieval', category: 'AI · ML', desc: 'Recommendation engine using vector embeddings and cosine similarity.', achievement: 'Low-latency retrieval from large-scale unstructured data.', tech: ['PyTorch', 'FAISS', 'React', 'Python'] },
    { title: 'GeoData Vis', category: 'DATA VIS', desc: 'Interactive visualization integrating datasets with geospatial context.', achievement: 'Synchronized 3D views with real-time filtering.', tech: ['Vue', 'Three.js', 'Node.js', 'REST'] },
    { title: 'Stock Portfolio', category: 'DATA SCIENCE', desc: 'Python + SQL analytics for real-world financial market data.', achievement: 'Automated pipeline from Yahoo Finance API.', tech: ['Python', 'SQL', 'Pandas'] },
    { title: 'Travel + LLM', category: 'FULL STACK', desc: 'Travel platform with LLM translating natural language to DB queries.', achievement: 'NL search across dual SQL/NoSQL, deployed with Docker.', tech: ['React', 'Node.js', 'MySQL', 'MongoDB', 'OpenAI'] },
    { title: 'NFC Reader', category: 'MOBILE', desc: 'iOS/Android app for NFC-based product authenticity verification.', achievement: '>99% scan accuracy across 200+ tested products.', tech: ['Swift', 'AWS Lambda', 'DynamoDB'] },
    { title: 'Medical Image AI', category: 'AI · ML', desc: 'Transfer learning fine-tuning VGG-16 for kidney CT classification.', achievement: '98.96% accuracy — 30% over baseline. Published.', tech: ['PyTorch', 'VGG-16', 'NumPy'] },
    { title: 'Emotional Relief', category: 'PRODUCT · UX', desc: 'AI emotional wellness app through product discovery and iterative design.', achievement: '85%+ willingness to pay. 100% recommendation intent.', tech: ['Java', 'JavaScript', 'Figma'] },
];

// Expand to 120 cards cycling through the 8 real projects
const PROJECTS = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    ...PROJECT_DATA[i % PROJECT_DATA.length],
}));

// ── Fibonacci sphere distribution with inner-radius gap ──
function fibonacciSphere(count, radius, innerRadiusFactor = 0.55) {
    const points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const ringRadius = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * ringRadius * radius;
        const z = Math.sin(theta) * ringRadius * radius;
        const dist = Math.sqrt(x * x + (y * radius) * (y * radius) + z * z);
        if (dist < radius * innerRadiusFactor) continue;
        points.push(new THREE.Vector3(x, y * radius, z));
    }
    return points;
}

export default function Experience({ stage, selectedProject, onSelect, onTransitionToAbout }) {
    const worldGroupRef = useRef();
    const controlsRef = useRef();
    const { camera } = useThree();
    const radius = 14;

    const items = useMemo(() => {
        const positions = fibonacciSphere(PROJECTS.length, radius, 0.5);
        return positions.map((pos, idx) => ({
            ...PROJECTS[idx % PROJECTS.length],
            id: idx,
            pos,
        }));
    }, []);

    // ── Camera init ──
    useEffect(() => {
        camera.position.set(0, 0, radius * 0.35);
        camera.fov = 78;
        camera.near = 0.1;
        camera.far = 200;
        camera.updateProjectionMatrix();
        camera.lookAt(0, 0, 0);
    }, [camera]);

    // ── Auto-drift + lookAt ──
    useFrame(() => {
        if (worldGroupRef.current && selectedProject === null) {
            worldGroupRef.current.rotation.y += 0.0003;
        }
        camera.lookAt(0, 0, 0);
    });

    // ── Scroll-driven About transition ──
    useEffect(() => {
        if (stage !== 'journey') return;
        let accumulated = 0;
        const threshold = 250;
        const homeZ = radius * 0.35;
        const onWheel = (e) => {
            if (selectedProject !== null) return;
            if (e.deltaY > 0) {
                accumulated += e.deltaY;
                const progress = Math.min(accumulated / threshold, 1);
                camera.position.z = homeZ - progress * (radius * 0.6);
                camera.updateProjectionMatrix();
                if (progress >= 1 && onTransitionToAbout) {
                    onTransitionToAbout();
                    accumulated = 0;
                }
            } else {
                accumulated = Math.max(0, accumulated + e.deltaY);
                const progress = Math.min(accumulated / threshold, 1);
                camera.position.z = homeZ - progress * (radius * 0.6);
                camera.updateProjectionMatrix();
            }
        };
        window.addEventListener('wheel', onWheel, { passive: true });
        return () => window.removeEventListener('wheel', onWheel);
    }, [stage, selectedProject, camera, onTransitionToAbout]);

    return (
        <>
            <ambientLight intensity={2.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <pointLight position={[-10, -5, -10]} intensity={0.4} />

            <OrbitControls
                ref={controlsRef}
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
                enableDamping
                dampingFactor={0.05}
                rotateSpeed={0.5}
            />

            {stage !== 'landing' && stage !== 'about' && (
                <InfinityAnchor />
            )}

            <group ref={worldGroupRef} position={[0, 0, 0]}>
                {items.map((item) => (
                    <ProjectCard
                        key={item.id}
                        project={item}
                        position={item.pos}
                        isFocused={selectedProject === item.id}
                        anyFocused={selectedProject !== null}
                        onSelect={() => onSelect(item.id)}
                    />
                ))}
            </group>
        </>
    );
}
