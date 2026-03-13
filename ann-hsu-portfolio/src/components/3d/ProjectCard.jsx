import { useMemo, useRef, useState, useEffect } from 'react';
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

    // Glassmorphism overlay at bottom ~35%
    const overlayTop = Math.round(h * 0.62);
    const overlayH = h - overlayTop;

    // Frosted glass effect: semi-transparent dark gradient
    const glass = ctx.createLinearGradient(0, overlayTop, 0, h);
    glass.addColorStop(0, 'rgba(0,0,0,0.0)');
    glass.addColorStop(0.15, 'rgba(0,0,0,0.35)');
    glass.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = glass;
    ctx.fillRect(0, overlayTop, w, overlayH);

    // Thin frosted highlight line at top of glass
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(32, overlayTop + Math.round(overlayH * 0.18));
    ctx.lineTo(w - 32, overlayTop + Math.round(overlayH * 0.18));
    ctx.stroke();

    // Category text
    const textY = overlayTop + Math.round(overlayH * 0.35);
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.font = '500 16px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0.1em';
    ctx.fillText((project.category || '').toUpperCase(), 36, textY);

    // Project name — semi-bold
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '600 30px "Inter", sans-serif';
    const titleY = textY + 34;
    const maxW = w - 72;
    const words = (project.title || '').split(' ');
    let line = '', y = titleY;
    words.forEach((word) => {
        const test = line + (line ? ' ' : '') + word;
        if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, 36, y); line = word; y += 36;
        } else { line = test; }
    });
    ctx.fillText(line, 36, y);

    // One-line description — lighter weight
    if (project.desc) {
        y += 28;
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.font = '400 16px "Inter", sans-serif';
        let desc = project.desc;
        if (ctx.measureText(desc).width > maxW) {
            while (ctx.measureText(desc + '…').width > maxW && desc.length > 0) desc = desc.slice(0, -1);
            desc += '…';
        }
        ctx.fillText(desc, 36, y);
    }

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
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
                onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
                frustumCulled={false}
            >
                <planeGeometry args={[1.1, 1.54]} />
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
