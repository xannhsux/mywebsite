import { Text } from '@react-three/drei';
import { useRef } from 'react';

export default function Sphere() {
    const meshRef = useRef();

    return (
        <mesh ref={meshRef}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial color="black" />

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
