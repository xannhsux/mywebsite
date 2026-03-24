import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Cover images from picsum (deterministic seeds) ──
const COVER_SEEDS = [100, 237, 342, 433, 500, 566];

// ── Canvas texture: full-bleed image + glassmorphism overlay + white text ──
function createCardTexture(project, coverImage) {
    const w = 512, h = 716; // ~1:1.4 aspect
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const r = 48; // 32px at display scale ≈ 48px on 512-wide canvas

    // Rounded rect clip
    ctx.beginPath();
    ctx.moveTo(r, 0); ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r); ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h); ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // Full-bleed cover image
    if (coverImage && coverImage.complete && coverImage.naturalWidth > 0) {
        const iw = coverImage.naturalWidth, ih = coverImage.naturalHeight;
        const scale = Math.max(w / iw, h / ih);
        const sw = iw * scale, sh = ih * scale;
        ctx.drawImage(coverImage, (w - sw) / 2, (h - sh) / 2, sw, sh);
    } else {
        // Gradient fallback
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#e8e8e8');
        grad.addColorStop(1, '#d0d0d0');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
    }

    // Subtle inner glow (light vignette)
    const glow = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8);
    glow.addColorStop(0, 'rgba(255,255,255,0.08)');
    glow.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // Dark overlay for text legibility
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.fillRect(0, 0, w, h);

    // Title — scaled to fill the entire card
    const titleText = (project.title || '').toUpperCase();
    const titlePadding = 40;
    const maxW = w - titlePadding * 2;
    // Split into words and try to fit as large as possible
    const words = titleText.split(' ');
    // Try fitting in 1 line first, then 2, then 3...
    let bestFontSize = 24;
    let bestLines = [titleText];
    for (let numLines = 1; numLines <= Math.min(words.length, 4); numLines++) {
        // Distribute words across lines
        const lines = [];
        const wordsPerLine = Math.ceil(words.length / numLines);
        for (let i = 0; i < words.length; i += wordsPerLine) {
            lines.push(words.slice(i, i + wordsPerLine).join(' '));
        }
        // Find max font size where all lines fit
        let fs = 200;
        ctx.font = `800 ${fs}px "Inter", sans-serif`;
        while (fs > 24) {
            ctx.font = `800 ${fs}px "Inter", sans-serif`;
            const allFit = lines.every(l => ctx.measureText(l).width <= maxW);
            if (allFit) break;
            fs -= 2;
        }
        // Check total height fits card
        const lineHeight = fs * 1.1;
        const totalH = lineHeight * lines.length;
        if (totalH <= h - titlePadding * 2 && fs > bestFontSize) {
            bestFontSize = fs;
            bestLines = lines;
        }
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `800 ${bestFontSize}px "Inter", sans-serif`;
    ctx.textAlign = 'left';
    const lineHeight = bestFontSize * 1.1;
    const totalTextH = lineHeight * bestLines.length;
    const startY = (h - totalTextH) / 2 + bestFontSize * 0.85;
    bestLines.forEach((line, i) => {
        ctx.fillText(line, titlePadding, startY + i * lineHeight);
    });

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

// ── Load a cover image ──
function loadCoverImage(seed) {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = `https://picsum.photos/seed/${seed}/512/716`;
    });
}

export default function ProjectCard({ project, position, isFocused, anyFocused, onSelect }) {
    const groupRef = useRef();
    const meshRef = useRef();
    const matRef = useRef();
    const [hovered, setHovered] = useState(false);
    const [texture, setTexture] = useState(null);
    const hoverTimer = useRef(null);

    // Load cover image + create texture
    useEffect(() => {
        const seed = COVER_SEEDS[project.id % COVER_SEEDS.length];
        loadCoverImage(seed).then((img) => {
            const tex = createCardTexture(project, img);
            setTexture(tex);
        });
    }, [project]);

    const initialRotation = useMemo(() => {
        const temp = new THREE.Object3D();
        temp.position.copy(position);
        temp.lookAt(0, 0, 0);
        return temp.rotation.clone();
    }, [position]);

    // Hover: subtle Z-approach + scale
    useFrame(() => {
        if (!meshRef.current) return;
        const targetZ = hovered ? 0.3 : 0;
        meshRef.current.position.z = THREE.MathUtils.lerp(
            meshRef.current.position.z, targetZ, 0.08
        );
        const targetScale = hovered ? 1.06 : 1;
        meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
        meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
    });

    return (
        <group ref={groupRef} position={position} rotation={initialRotation}>
            <mesh
                ref={meshRef}
                onPointerOver={() => {
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                    hoverTimer.current = setTimeout(() => onSelect(), 5);
                }}
                onPointerOut={() => {
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                    if (hoverTimer.current) { clearTimeout(hoverTimer.current); hoverTimer.current = null; }
                }}
                frustumCulled={false}
            >
                <planeGeometry args={[1.58, 2.22]} />
                <meshStandardMaterial
                    ref={matRef}
                    map={texture}
                    transparent
                    opacity={anyFocused && !isFocused ? 0.25 : 1}
                    roughness={0.15}
                    metalness={0}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}
