import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

export default function ProjectCard({ project, position, stage }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // CORE TASK: Card Orientation logic
    // Calculate the rotation needed for cards to face the surface center
    const initialRotation = useMemo(() => {
        const tempObj = new THREE.Object3D();
        tempObj.position.copy(position);
        tempObj.lookAt(0, 0, 0);
        return tempObj.rotation.clone();
    }, [position]);

    // Smooth Hover Animation
    const handlePointerOver = () => {
        setHovered(true);
        // GSAP or Framer-motion-3d for scale + translation
        gsap.to(meshRef.current.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.3, ease: 'power2.out' });
    };

    const handlePointerOut = () => {
        setHovered(false);
        gsap.to(meshRef.current.scale, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'expo.out' });
    };

    return (
        <group position={position} rotation={initialRotation}>
            <mesh
                ref={meshRef}
                onPointerOver={handlePointerOver}
                onPointerOut={handlePointerOut}
                onPointerDown={() => console.log('Selection:', project.title)}
            >
                <planeGeometry args={[1, 0.6]} />
                <meshStandardMaterial
                    color="white"
                    roughness={0.1}
                    metalness={0.05}
                    side={THREE.DoubleSide}
                />

                {/* Core Project Text */}
                <Text
                    position={[0, 0.1, 0.02]}
                    fontSize={0.04}
                    color="#888"
                    anchorX="center"
                    letterSpacing={0.1}
                    font="/fonts/Inter-Medium.ttf" // Fallback to system default if font load fails
                >
                    {project.category}
                </Text>

                <Text
                    position={[0, -0.05, 0.02]}
                    fontSize={0.08}
                    color="black"
                    fontWeight="bold"
                    anchorX="center"
                    font="/fonts/Inter-Bold.ttf"
                >
                    {project.title}
                </Text>

                {/* Navy Highlight Border on Hover */}
                {hovered && (
                    <mesh position={[0, 0, -0.01]}>
                        <planeGeometry args={[1.05, 0.65]} />
                        <meshBasicMaterial color="#002147" />
                    </mesh>
                )}
            </mesh>
        </group>
    );
}
