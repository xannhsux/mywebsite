import { MeshDistortMaterial, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

export default function Sphere() {
    const meshRef = useRef();

    useFrame((state) => {
        // Breathing/Pulse effect
        const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.05;
        meshRef.current.scale.set(scale, scale, scale);
    });

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial color="#002147" />

            <Text
                position={[0, 0, 1.05]}
                fontSize={0.25}
                letterSpacing={0.1}
                color="white"
                anchorX="center"
                anchorY="middle"
            >
                Start
            </Text>
        </mesh>
    );
}
