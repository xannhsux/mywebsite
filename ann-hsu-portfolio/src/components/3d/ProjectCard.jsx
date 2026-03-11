import { useMemo, useRef, useEffect, useState } from 'react';
import { Text, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

// Reusable vectors
const _worldPos = new THREE.Vector3();
const _camDir = new THREE.Vector3();

export default function ProjectCard({ project, position, isFocused, anyFocused, onSelect }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);
    const tweenRef = useRef([]);  // store active GSAP tweens
    const { camera } = useThree();

    // ── Initial rotation: face the origin ──
    const initialRotation = useMemo(() => {
        const temp = new THREE.Object3D();
        temp.position.copy(position);
        temp.lookAt(0, 0, 0);
        return temp.rotation.clone();
    }, [position]);

    // Store initial values for GSAP to tween back to
    const initialState = useMemo(() => ({
        px: position.x, py: position.y, pz: position.z,
        rx: initialRotation.x, ry: initialRotation.y, rz: initialRotation.z,
        sx: 1, sy: 1, sz: 1,
    }), [position, initialRotation]);

    // ── Focus / Unfocus GSAP animation ──
    useEffect(() => {
        if (!groupRef.current) return;
        const g = groupRef.current;

        // Kill any running tweens
        tweenRef.current.forEach(t => t.kill());
        tweenRef.current = [];

        if (isFocused) {
            // Compute target: 2.5 units in front of camera, in parent-local space
            const parent = g.parent;
            if (!parent) return;
            parent.updateWorldMatrix(true, false);

            // Camera forward direction
            camera.getWorldDirection(_camDir);
            // Target world position = camera pos + forward * 2.5
            _worldPos.copy(camera.position).add(_camDir.clone().multiplyScalar(2.5));
            // Convert to parent local space
            const targetLocal = parent.worldToLocal(_worldPos.clone());

            // Compute rotation to face camera in parent-local space
            const camLocal = parent.worldToLocal(camera.position.clone());
            const tempObj = new THREE.Object3D();
            tempObj.position.copy(targetLocal);
            tempObj.lookAt(camLocal);

            const t1 = gsap.to(g.position, {
                x: targetLocal.x, y: targetLocal.y, z: targetLocal.z,
                duration: 1.0, ease: 'expo.out',
            });
            const t2 = gsap.to(g.rotation, {
                x: tempObj.rotation.x, y: tempObj.rotation.y, z: tempObj.rotation.z,
                duration: 1.0, ease: 'expo.out',
            });
            const t3 = gsap.to(g.scale, {
                x: 2.8, y: 2.8, z: 2.8,
                duration: 1.0, ease: 'expo.out',
            });
            tweenRef.current = [t1, t2, t3];
        } else {
            // Return to Fibonacci shell position
            const t1 = gsap.to(g.position, {
                x: initialState.px, y: initialState.py, z: initialState.pz,
                duration: 0.8, ease: 'power3.inOut',
            });
            const t2 = gsap.to(g.rotation, {
                x: initialState.rx, y: initialState.ry, z: initialState.rz,
                duration: 0.8, ease: 'power3.inOut',
            });
            const t3 = gsap.to(g.scale, {
                x: 1, y: 1, z: 1,
                duration: 0.8, ease: 'power3.inOut',
            });
            tweenRef.current = [t1, t2, t3];
        }
    }, [isFocused, camera, initialState]);

    // ── Hover: subtle Z-approach ──
    useFrame(() => {
        if (!meshRef.current || isFocused) return;
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
                {/* Portrait card 1.0 × 1.4 */}
                <planeGeometry args={[1, 1.4]} />
                <meshStandardMaterial
                    color="#FFFFFF"
                    transparent
                    opacity={anyFocused && !isFocused ? 0.1 : 1}
                    roughness={0.1}
                    metalness={0.05}
                    side={THREE.DoubleSide}
                />

                {/* Border */}
                <mesh position={[0, 0, -0.005]}>
                    <planeGeometry args={[1.02, 1.42]} />
                    <meshBasicMaterial
                        color="#002147"
                        transparent
                        opacity={anyFocused && !isFocused ? 0.02 : 0.15}
                    />
                </mesh>

                {/* Category (always visible) */}
                <Text
                    position={[0, 0.45, 0.01]}
                    fontSize={0.05} color="#002147"
                    fontWeight="700" letterSpacing={0.1}
                >
                    {project.category}
                </Text>

                {/* Title (always visible) */}
                <Text
                    position={[0, 0, 0.01]}
                    fontSize={0.1} color="#000000"
                    fontWeight="900" maxWidth={0.8}
                    textAlign="center" lineHeight={1.1}
                >
                    {project.title.toUpperCase()}
                </Text>
            </mesh>

            {/* ── Rich HTML content overlay (only when focused) ── */}
            {isFocused && (
                <Html
                    position={[0, 0, 0.02]}
                    center
                    distanceFactor={1.5}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                    <div style={{
                        width: '320px',
                        fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
                        color: '#001A3A',
                        textAlign: 'left',
                        padding: '24px',
                    }}>
                        {/* Category */}
                        <div style={{
                            fontSize: '9px',
                            letterSpacing: '0.35em',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            opacity: 0.4,
                            marginBottom: '8px',
                            fontFamily: '"JetBrains Mono", monospace',
                        }}>
                            {project.category}
                        </div>

                        {/* Title */}
                        <div style={{
                            fontSize: '22px',
                            fontWeight: 900,
                            letterSpacing: '-0.02em',
                            marginBottom: '14px',
                            lineHeight: 1.15,
                        }}>
                            {project.title}
                        </div>

                        {/* Description */}
                        <div style={{
                            fontSize: '11px',
                            lineHeight: 1.7,
                            opacity: 0.55,
                            marginBottom: '16px',
                        }}>
                            {project.desc}
                        </div>

                        {/* Achievement */}
                        <div style={{
                            fontSize: '11px',
                            lineHeight: 1.6,
                            fontWeight: 600,
                            color: '#002147',
                            opacity: 0.75,
                            marginBottom: '18px',
                            paddingLeft: '10px',
                            borderLeft: '2px solid #00214730',
                        }}>
                            {project.achievement}
                        </div>

                        {/* Tech Stack */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {project.tech.map((t) => (
                                <span key={t} style={{
                                    fontSize: '9px',
                                    fontWeight: 500,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    padding: '4px 10px',
                                    borderRadius: '100px',
                                    background: '#0021470A',
                                    color: '#00214780',
                                    border: '1px solid #00214712',
                                    fontFamily: '"JetBrains Mono", monospace',
                                }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </Html>
            )}
        </group>
    );
}
