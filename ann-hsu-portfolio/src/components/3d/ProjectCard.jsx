import { useMemo, useRef, useState } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function ProjectCard({ project, position, isFocused, anyFocused, onSelect }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    const initialRotation = useMemo(() => {
        const temp = new THREE.Object3D();
        temp.position.copy(position);
        temp.lookAt(0, 0, 0);
        return temp.rotation.clone();
    }, [position]);

    // Hover: subtle Z-approach
    useFrame(() => {
        if (!meshRef.current) return;
        const target = hovered ? 0.25 : 0;
        meshRef.current.position.z = THREE.MathUtils.lerp(
            meshRef.current.position.z, target, 0.08
        );
    });

    return (
        <group ref={groupRef} position={position} rotation={initialRotation}>
            <mesh
                ref={meshRef}
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                frustumCulled={false}
            >
                <planeGeometry args={[1, 1.4]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={anyFocused && !isFocused ? 0.3 : 1}
                    roughness={0.1}
                    metalness={0.05}
                    side={THREE.DoubleSide}
                />
                <mesh position={[0, 0, -0.005]}>
                    <planeGeometry args={[1.02, 1.42]} />
                    <meshBasicMaterial color="#002147" transparent opacity={0.18} />
                </mesh>
                <Text
                    position={[0, 0.45, 0.01]}
                    fontSize={0.05} color="#002147"
                    fontWeight="700" letterSpacing={0.1}
                >
                    {project.category}
                </Text>
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.1} color="#000000"
                    fontWeight="900" maxWidth={0.8}
                    textAlign="center" lineHeight={1.1}
                >
                    {project.title.toUpperCase()}
                </Text>
            </mesh>
        </group>
    );
}
