import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProjectCard from './ProjectCard';
import InfinityAnchor from './InfinityAnchor';

// ── Rich project data ──
const PROJECTS = [
    {
        id: 0, title: 'Aero Logic', category: 'SYSTEMS',
        desc: 'A distributed flight control system built with Rust and real-time telemetry. Handles concurrent sensor data streams with sub-millisecond latency.',
        achievement: 'Reduced telemetry latency by 94%, handling 12K concurrent sensor feeds in production.',
        tech: ['Rust', 'gRPC', 'Redis', 'Docker'],
    },
    {
        id: 1, title: 'Cipher Core', category: 'DATA SCIENCE',
        desc: 'End-to-end encrypted data pipeline for sensitive financial analytics. Features zero-knowledge proofs and homomorphic encryption.',
        achievement: 'Processed $2.8B in encrypted financial transactions with zero data breaches.',
        tech: ['Python', 'PySpark', 'AWS', 'Crypto'],
    },
    {
        id: 2, title: 'Genesis ML', category: 'DESIGN SYSTEM',
        desc: 'A machine learning framework with visual model builder. Drag-and-drop neural network architecture design with real-time training visualization.',
        achievement: 'Used by 1,200+ researchers. Cut model prototyping time by 60%.',
        tech: ['PyTorch', 'React', 'D3.js', 'WebGL'],
    },
    {
        id: 3, title: 'Vision Lab', category: 'AI LAB',
        desc: 'Computer vision platform for real-time object detection and scene understanding. Processes 60fps video feeds with custom YOLO variants.',
        achievement: 'Achieved 97.2% mAP on custom benchmarks at 60fps inference speed.',
        tech: ['OpenCV', 'TensorRT', 'CUDA', 'FastAPI'],
    },
    {
        id: 4, title: 'Neural Flow', category: 'SYSTEMS',
        desc: 'Interactive 3D neural network visualizer. Explore model architectures, watch activations propagate, and debug training in real time.',
        achievement: 'Featured in TensorFlow Dev Summit. 3K+ GitHub stars.',
        tech: ['Three.js', 'TF.js', 'WebGL', 'WASM'],
    },
    {
        id: 5, title: 'Aether UI', category: 'DATA SCIENCE',
        desc: 'Open-source design system with 40+ accessible components. Features glassmorphism, fluid animations, and full dark mode support.',
        achievement: 'Adopted by 200+ teams. 98/100 Lighthouse accessibility score.',
        tech: ['React', 'Storybook', 'CSS', 'A11y'],
    },
];

// Build 120 cards from the 6 projects
const ALL_PROJECTS = Array.from({ length: 120 }, (_, i) => ({
    ...PROJECTS[i % PROJECTS.length],
    id: i,
}));

// ── Fibonacci sphere distribution with inner‑radius gap ──
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
        const positions = fibonacciSphere(ALL_PROJECTS.length, radius, 0.5);
        return positions.map((pos, idx) => ({
            ...ALL_PROJECTS[idx % ALL_PROJECTS.length],
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

    // ── Auto-drift (pauses when card focused) + lookAt ──
    useFrame(() => {
        if (worldGroupRef.current && selectedProject === null) {
            worldGroupRef.current.rotation.y += 0.0003;
        }
        camera.lookAt(0, 0, 0);
    });

    // ── Disable orbit when focused ──
    useEffect(() => {
        if (controlsRef.current) {
            controlsRef.current.enabled = selectedProject === null;
        }
    }, [selectedProject]);

    // ── Scroll‑driven About transition ──
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

    // ── Click empty space → deselect ──
    const handleMiss = useCallback(() => {
        if (selectedProject !== null) onSelect(null);
    }, [selectedProject, onSelect]);

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

            {stage !== 'landing' && stage !== 'about' && <InfinityAnchor />}

            <group ref={worldGroupRef} onPointerMissed={handleMiss}>
                {items.map((item) => (
                    <ProjectCard
                        key={item.id}
                        project={item}
                        position={item.pos}
                        isFocused={selectedProject === item.id}
                        anyFocused={selectedProject !== null}
                        onSelect={() => onSelect(selectedProject === item.id ? null : item.id)}
                    />
                ))}
            </group>
        </>
    );
}
