import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import {
    PresentationControls,
    ContactShadows,
    Environment,
    Float,
    Text,
    Html
} from '@react-three/drei';
import * as THREE from 'three';
import Sphere from './Sphere';
import ProjectCard from './ProjectCard';

const PROJECTS = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    title: [
        'Fashion AI', 'Retrieval Engine', 'GeoData Vis', 'Stock Analytics',
        'Travel LLM', 'NFC iOS App', 'Kidney CT Study', 'Wellness App',
        'Deep Search', 'Vision Lab', 'Neural Flow', 'Aero Logic'
    ][i % 12],
    category: ['ML', 'Engineering', 'Frontend', 'Software'][i % 4],
    meta: '2022-2024'
}));

export default function Experience({ stage }) {
    const { viewport } = useThree();
    const groupRef = useRef();

    // Fibonacci Sphere Distribution Logic
    const positions = useMemo(() => {
        const radius = 3.8; // Larger radius for more density
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        const n = PROJECTS.length;

        return PROJECTS.map((_, i) => {
            const y = 1 - (i / (n - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            return new THREE.Vector3(x * radius, y * radius, z * radius);
        });
    }, []);

    return (
        <>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <Environment preset="studio" />

            <PresentationControls
                global
                config={{ mass: 3, tension: 200 }}
                snap={{ mass: 4, tension: 150 }}
                rotation={[0.2, 0, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI, Math.PI]}
            >
                <group ref={groupRef}>
                    <Sphere />

                    {/* Project List Arrangement */}
                    {PROJECTS.map((project, i) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            position={positions[i]}
                            stage={stage}
                        />
                    ))}
                </group>
            </PresentationControls>
        </>
    );
}
