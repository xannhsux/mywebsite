import { useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { PresentationControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import ProjectCard from './ProjectCard';

// Dummy Project Data
const PROJECTS = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    title: ['Neural Flow', 'Aero Logic', 'Aether UI', 'Vision Lab', 'Cipher Core', 'Genesis ML'][i % 6],
    category: i % 2 === 0 ? 'Engineering' : 'Frontend Architecture',
}));

export default function Experience({ stage }) {
    const { viewport } = useThree();

    // CORE TASK: Fibonacci Sphere Algorithm
    // Distributes points equidistant on a sphere's surface
    const positions = useMemo(() => {
        const radius = 4; // Sphere radius
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        const n = PROJECTS.length;

        return PROJECTS.map((_, i) => {
            const y = 1 - (i / (n - 1)) * 2;
            const r = Math.sqrt(1 - y * y);
            const theta = phi * i;

            const x = Math.cos(theta) * r;
            const z = Math.sin(theta) * r;

            // Returns the position vectors relative to the center
            return new THREE.Vector3(x * radius, y * radius, z * radius);
        });
    }, []);

    return (
        <>
            <ambientLight intensity={1} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Environment preset="studio" />

            {/* CORE TASK: Damping / Smooth Interaction Controller */}
            <PresentationControls
                global
                config={{ mass: 3, tension: 150, friction: 50 }} // Smooth physical inertia
                snap={{ mass: 4, tension: 100, friction: 30 }}  // Snap back loosely
                rotation={[0.1, 0, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI, Math.PI]}
            >
                <group position={[0, 0, 0]}>
                    {/* Mapping Cards into the sphere */}
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

            {/* Surface floor for visual grounding */}
            {stage !== 'landing' && <ContactShadows position={[0, -5, 0]} opacity={0.25} scale={20} blur={3} far={10} />}
        </>
    );
}
