import { useMemo, useRef, useEffect, useCallback } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import ProjectCard from './ProjectCard';
import InfinityAnchor from './InfinityAnchor';

// ── Project data ──
const PROJECTS = Array.from({ length: 120 }, (_, i) => ({
    id: i,
    title: ['Aero Logic', 'Cipher Core', 'Genesis ML', 'Vision Lab', 'Neural Flow', 'Aether UI'][i % 6],
    category: ['SYSTEMS', 'DATA SCIENCE', 'DESIGN SYSTEM', 'AI LAB'][i % 4],
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

    // ── Auto‑drift + lookAt ──
    useFrame(() => {
        if (worldGroupRef.current && selectedProject === null) {
            worldGroupRef.current.rotation.y += 0.0003;
        }
        camera.lookAt(0, 0, 0);
    });

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
