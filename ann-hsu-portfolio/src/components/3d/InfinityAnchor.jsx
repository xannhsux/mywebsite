import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Canvas texture with two "CREATING" words placed sequentially,
 * so they follow each other like a train along the tube surface.
 */
function createTextTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Single "CREATING" centered on the texture
    ctx.fillText('CREATING', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);
    texture.needsUpdate = true;
    return texture;
}

export default function InfinityAnchor() {
    const groupRef = useRef();
    const meshRef = useRef();
    const textMeshRef = useRef();

    // ── Full lemniscate of Bernoulli (single continuous loop) ──
    const curve = useMemo(() => {
        const path = new THREE.Curve();
        const a = 2.5;
        path.getPoint = (t) => {
            const angle = t * Math.PI * 2;
            const denom = 1 + Math.pow(Math.sin(angle), 2);
            const x = (a * Math.cos(angle)) / denom;
            const y = (a * Math.sin(angle) * Math.cos(angle)) / denom;
            return new THREE.Vector3(x, y, 0);
        };
        return path;
    }, []);

    const tubeGeometry = useMemo(() => {
        return new THREE.TubeGeometry(curve, 200, 0.14, 16, true);
    }, [curve]);

    const textTexture = useMemo(() => createTextTexture(), []);

    // ── Every frame: face camera + scroll texture ──
    useFrame(({ camera }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = camera.rotation.y + Math.PI;
        }
        if (textTexture) {
            textTexture.offset.x += 0.0003;
        }
    });

    return (
        <group ref={groupRef} scale={0.96}>
            {/* Base tube — deep blue matte */}
            <mesh ref={meshRef} geometry={tubeGeometry}>
                <meshBasicMaterial color="#002147" />
            </mesh>

            {/* Text decal — both words flow together along the path */}
            <mesh ref={textMeshRef} geometry={tubeGeometry}>
                <meshBasicMaterial
                    map={textTexture}
                    transparent
                    opacity={0.8}
                    depthWrite={false}
                    side={THREE.FrontSide}
                />
            </mesh>
        </group>
    );
}
