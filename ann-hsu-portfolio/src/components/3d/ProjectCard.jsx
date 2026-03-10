import { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, MeshWobbleMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function ProjectCard({ project, position, stage }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    // Orientation logic: cards perpendicular to the sphere surface
    const initialRotation = useMemo(() => {
        const tempObj = new THREE.Object3D();
        tempObj.position.copy(position);
        tempObj.lookAt(0, 0, 0);
        return tempObj.rotation.clone();
    }, [position]);

    return (
        <group position={position} rotation={initialRotation}>
            <mesh
                ref={meshRef}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <planeGeometry args={[0.9, 0.6]} />
                <meshStandardMaterial
                    color="white"
                    roughness={0.1}
                    metalness={0}
                />

                <Text
                    position={[0, 0.1, 0.01]}
                    fontSize={0.035}
                    color="#999"
                    anchorX="center"
                >
                    {project.category}
                </Text>

                <Text
                    position={[0, -0.02, 0.01]}
                    fontSize={0.07}
                    color="black"
                    anchorX="center"
                >
                    {project.title}
                </Text>

                <Text
                    position={[0, -0.15, 0.01]}
                    fontSize={0.025}
                    color="#ccc"
                    anchorX="center"
                >
                    {project.meta}
                </Text>

                {/* Highlight border on hover */}
                {hovered && (
                    <mesh position={[0, 0, -0.005]}>
                        <planeGeometry args={[0.92, 0.62]} />
                        <meshBasicMaterial color="black" />
                    </mesh>
                )}
            </mesh>
        </group>
    );
}
