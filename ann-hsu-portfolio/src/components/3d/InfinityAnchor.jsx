import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Canvas texture for a single "CREATING" label used by sprites.
 * Sprites always face the camera → text is always upright.
 */
function createTextTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CREATING', canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

export default function InfinityAnchor() {
    const groupRef = useRef();
    const meshRef = useRef();
    const sprite1Ref = useRef();
    const sprite2Ref = useRef();
    const tRef = useRef(0);

    const a = 2.5;

    // ── Full lemniscate of Bernoulli (single continuous loop) ──
    const curve = useMemo(() => {
        const path = new THREE.Curve();
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

    // ── Every frame: face camera + move text sprites along curve ──
    useFrame(({ camera }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = camera.rotation.y + Math.PI;
        }

        // Advance two sprites along the curve (opposite sides)
        tRef.current = (tRef.current + 0.0003) % 1;
        const t1 = tRef.current;
        const t2 = (tRef.current + 0.5) % 1;

        if (sprite1Ref.current) {
            const p = curve.getPoint(t1);
            sprite1Ref.current.position.set(p.x, p.y, 0.18);
        }
        if (sprite2Ref.current) {
            const p = curve.getPoint(t2);
            sprite2Ref.current.position.set(p.x, p.y, 0.18);
        }
    });

    return (
        <group ref={groupRef} scale={1.2}>
            {/* Base tube — deep blue matte */}
            <mesh ref={meshRef} geometry={tubeGeometry}>
                <meshBasicMaterial color="#002147" />
            </mesh>

            {/* Text sprites — always face camera, always upright */}
            <sprite ref={sprite1Ref} scale={[1.6, 0.2, 1]}>
                <spriteMaterial
                    map={textTexture}
                    transparent
                    opacity={0.8}
                    depthWrite={false}
                />
            </sprite>
            <sprite ref={sprite2Ref} scale={[1.6, 0.2, 1]}>
                <spriteMaterial
                    map={textTexture}
                    transparent
                    opacity={0.8}
                    depthWrite={false}
                />
            </sprite>
        </group>
    );
}
