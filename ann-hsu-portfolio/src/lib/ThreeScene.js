import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ─────────────────────────────────────────────────────────
// Rich project data
// ─────────────────────────────────────────────────────────
const PROJECTS = [
    { title: 'Fashion AI', category: 'AI · PRODUCT', desc: 'AI-powered fashion app tackling unmet user needs through competitive analysis and user validation.', achievement: '44 of 50 interviewees signed up for early testing — 88% conversion rate.', tech: ['Python', 'React', 'AI/ML', 'Figma'] },
    { title: 'Knowledge Retrieval', category: 'AI · ML', desc: 'Scalable recommendation engine using vector embeddings and cosine similarity for intelligent context retrieval.', achievement: 'Low-latency retrieval from large-scale unstructured data with full-stack feedback loop.', tech: ['PyTorch', 'FAISS', 'React', 'Python'] },
    { title: 'GeoData Vis', category: 'DATA VIS', desc: 'Interactive data visualization platform integrating structured datasets with geospatial context for decision support.', achievement: 'Synchronized 3D views and map-based interfaces with real-time filtering.', tech: ['Vue', 'Three.js', 'Node.js', 'REST'] },
    { title: 'Stock Portfolio', category: 'DATA SCIENCE', desc: 'Python and SQL analytics system for ingesting, cleaning, and analyzing real-world financial market data.', achievement: 'Automated pipeline from Yahoo Finance API with normalized relational data model.', tech: ['Python', 'SQL', 'Pandas'] },
    { title: 'Travel + LLM', category: 'FULL STACK', desc: 'Travel data platform with LLM integration translating natural language queries into dynamic database calls.', achievement: 'Natural language search across dual SQL/NoSQL architecture, deployed with Docker.', tech: ['React', 'Node.js', 'MySQL', 'MongoDB', 'OpenAI'] },
    { title: 'NFC Reader', category: 'MOBILE', desc: 'Cross-platform iOS/Android app enabling NFC chip scanning for real-time product authenticity verification.', achievement: '>99% scan accuracy across 200+ tested products. Delivered in 4 months.', tech: ['Swift', 'AWS Lambda', 'DynamoDB'] },
    { title: 'Medical Image AI', category: 'AI · ML', desc: 'Transfer learning study fine-tuning VGG-16 for kidney CT classification with published research findings.', achievement: '98.96% accuracy — 30% improvement over baseline. Published research.', tech: ['PyTorch', 'VGG-16', 'NumPy'] },
    { title: 'Emotional Relief', category: 'PRODUCT · UX', desc: 'AI-based emotional wellness app built through end-to-end product discovery, user research, and iterative design.', achievement: '85%+ willingness to pay. 100% recommendation intent from usability testing.', tech: ['Java', 'JavaScript', 'Figma'] },
];

// ─────────────────────────────────────────────────────────
// Fibonacci sphere with inner-radius culling
// ─────────────────────────────────────────────────────────
function fibonacciSphere(count, radius, innerFactor = 0.5) {
    const pts = [];
    const ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const θ = ga * i;
        const x = Math.cos(θ) * r * radius;
        const z = Math.sin(θ) * r * radius;
        const d = Math.sqrt(x * x + (y * radius) ** 2 + z * z);
        if (d < radius * innerFactor) continue;
        pts.push(new THREE.Vector3(x, y * radius, z));
    }
    return pts;
}

// ─────────────────────────────────────────────────────────
// Canvas-based card texture (category + title on white)
// ─────────────────────────────────────────────────────────
// Soft gradient colors for the image placeholder area (one per project)
const CARD_GRADIENTS = [
    ['#E8E0F0', '#D4C8E2'],  // lavender
    ['#D6E5F0', '#BDD4E8'],  // sky
    ['#E0ECE4', '#C8DED0'],  // sage
    ['#F0E8DC', '#E2D8C6'],  // sand
    ['#DCE8F0', '#C4D8EA'],  // powder
    ['#F0E0E4', '#E2CCD4'],  // blush
    ['#E4E8F0', '#CCD4E6'],  // steel
    ['#EEE8DC', '#DED4C4'],  // cream
];

function createCardTexture(project, index) {
    const w = 512, h = 716;
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const ctx = c.getContext('2d');
    const r = 32; // corner radius

    // Rounded rect clip path
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.clip();

    // White background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Image placeholder area — soft gradient (top 62%)
    const imgH = h * 0.62;
    const colors = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
    const grad = ctx.createLinearGradient(0, 0, w, imgH);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, imgH);

    // Category label inside image area (top left)
    ctx.fillStyle = '#002147';
    ctx.globalAlpha = 0.45;
    ctx.font = '600 14px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(project.category, 28, 38);
    ctx.globalAlpha = 1;

    // Project name — bottom area
    ctx.fillStyle = '#111111';
    ctx.font = '700 28px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'left';
    // Word wrap for title
    const words = project.title.split(' ');
    let line = '';
    let y = imgH + 42;
    const maxW = w - 56;
    words.forEach((word) => {
        const test = line + (line ? ' ' : '') + word;
        if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, 28, y);
            line = word;
            y += 34;
        } else {
            line = test;
        }
    });
    ctx.fillText(line, 28, y);

    // One-line description
    ctx.fillStyle = '#888888';
    ctx.font = '400 15px "Inter", "Helvetica Neue", Arial, sans-serif';
    // Truncate to fit
    let desc = project.desc;
    while (ctx.measureText(desc).width > maxW * 2 && desc.length > 0) {
        desc = desc.slice(0, -1);
    }
    // Wrap to 2 lines max
    const descWords = desc.split(' ');
    line = '';
    y += 28;
    let descLine = 0;
    descWords.forEach((word) => {
        if (descLine >= 2) return;
        const test = line + (line ? ' ' : '') + word;
        if (ctx.measureText(test).width > maxW && line) {
            ctx.fillText(line, 28, y);
            line = word;
            y += 20;
            descLine++;
        } else {
            line = test;
        }
    });
    if (descLine < 2 && line) ctx.fillText(line, 28, y);

    const tex = new THREE.CanvasTexture(c);
    tex.needsUpdate = true;
    return tex;
}

// ─────────────────────────────────────────────────────────
// Canvas texture for the infinity symbol "CREATING" text
// ─────────────────────────────────────────────────────────
function createCreatingTexture() {
    const c = document.createElement('canvas');
    c.width = 1024; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px "Inter", "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('CREATING', c.width / 2, c.height / 2);
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.needsUpdate = true;
    return tex;
}

// ─────────────────────────────────────────────────────────
// Lemniscate curve for infinity symbol
// ─────────────────────────────────────────────────────────
class LemniscateCurve extends THREE.Curve {
    constructor(a = 2.5) { super(); this.a = a; }
    getPoint(t) {
        const θ = t * Math.PI * 2;
        const d = 1 + Math.sin(θ) ** 2;
        return new THREE.Vector3(
            (this.a * Math.cos(θ)) / d,
            (this.a * Math.sin(θ) * Math.cos(θ)) / d,
            0
        );
    }
}

// ═════════════════════════════════════════════════════════
// ThreeScene — the main WebGL scene class
// ═════════════════════════════════════════════════════════
export default class ThreeScene {
    constructor(container, callbacks = {}) {
        this.container = container;
        this.onCardSelect = callbacks.onCardSelect || (() => { });
        this.onScrollAbout = callbacks.onScrollAbout || (() => { });

        this.RADIUS = 14;
        this.hoveredCard = null;
        this.disposed = false;
        this.scrollAccum = 0;

        this._initRenderer();
        this._initScene();
        this._initCamera();
        this._initControls();
        this._initLights();
        this._initInfinity();
        this._initCards();
        this._initRaycaster();
        this._initEvents();
        this._animate();
    }

    // ── Renderer ──
    _initRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setClearColor(0xFFFFFF, 1);
        this.container.appendChild(this.renderer.domElement);
        this.renderer.domElement.style.touchAction = 'none';
    }

    // ── Scene ──
    _initScene() {
        this.scene = new THREE.Scene();
    }

    // ── Camera (inside the sphere) ──
    _initCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(78, aspect, 0.1, 200);
        this.camera.position.set(0, 0, this.RADIUS * 0.35);
        this.camera.lookAt(0, 0, 0);
        this.homeZ = this.RADIUS * 0.35;
    }

    // ── Orbit controls (horizontal only) ──
    _initControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableZoom = false;
        this.controls.enablePan = false;
        this.controls.minPolarAngle = Math.PI / 2;
        this.controls.maxPolarAngle = Math.PI / 2;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
    }

    // ── Lighting ──
    _initLights() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 2.2));
        const p1 = new THREE.PointLight(0xffffff, 0.8);
        p1.position.set(10, 10, 10);
        this.scene.add(p1);
        const p2 = new THREE.PointLight(0xffffff, 0.4);
        p2.position.set(-10, -5, -10);
        this.scene.add(p2);
    }

    // ── Infinity symbol ──
    _initInfinity() {
        this.infinityGroup = new THREE.Group();
        this.infinityGroup.scale.set(1.2, 1.2, 1.2);

        const curve = new LemniscateCurve(2.5);
        const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.14, 16, true);

        // Base: matte deep blue
        const baseMat = new THREE.MeshBasicMaterial({ color: 0x002147 });
        this.infinityGroup.add(new THREE.Mesh(tubeGeo, baseMat));

        // Text overlay
        this.creatingTexture = createCreatingTexture();
        const textMat = new THREE.MeshBasicMaterial({
            map: this.creatingTexture,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            side: THREE.FrontSide,
        });
        this.infinityGroup.add(new THREE.Mesh(tubeGeo, textMat));

        this.scene.add(this.infinityGroup);
    }

    // ── Cards ──
    _initCards() {
        this.worldGroup = new THREE.Group();
        this.scene.add(this.worldGroup);

        const positions = fibonacciSphere(120, this.RADIUS, 0.5);
        const planeGeo = new THREE.PlaneGeometry(1, 1.4);

        // Generate 6 shared textures
        const textures = PROJECTS.map((p, i) => createCardTexture(p, i));

        this.cards = [];
        this.cardMeshes = [];   // for raycasting

        positions.forEach((pos, i) => {
            const projIdx = i % PROJECTS.length;
            const project = { ...PROJECTS[projIdx], id: i };

            const mat = new THREE.MeshStandardMaterial({
                map: textures[projIdx],
                transparent: true,
                opacity: 1,
                roughness: 0.1,
                metalness: 0.05,
                side: THREE.DoubleSide,
            });

            const mesh = new THREE.Mesh(planeGeo, mat.clone());
            mesh.position.copy(pos);
            mesh.lookAt(0, 0, 0);  // face center

            // Store original state
            mesh.userData = {
                project,
                origPos: pos.clone(),
                origRot: mesh.rotation.clone(),
                origScale: new THREE.Vector3(1, 1, 1),
                hoverZ: 0,
            };

            this.worldGroup.add(mesh);
            this.cards.push(mesh);
            this.cardMeshes.push(mesh);
        });
    }

    // ── Raycaster ──
    _initRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
    }

    // ── Events ──
    _initEvents() {
        const dom = this.renderer.domElement;

        // Mouse move (hover)
        this._onMoveHandler = (e) => this._onPointerMove(e);
        dom.addEventListener('pointermove', this._onMoveHandler);

        // Click
        this._onClickHandler = (e) => this._onClick(e);
        dom.addEventListener('click', this._onClickHandler);

        // Resize
        this._onResizeHandler = () => this._onResize();
        window.addEventListener('resize', this._onResizeHandler);

        // Scroll (About transition)
        this._onWheelHandler = (e) => this._onWheel(e);
        window.addEventListener('wheel', this._onWheelHandler, { passive: true });
    }

    _getNDC(e) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    _onPointerMove(e) {
        this._getNDC(e);
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hits = this.raycaster.intersectObjects(this.cardMeshes);

        if (hits.length > 0) {
            const mesh = hits[0].object;
            if (this.hoveredCard !== mesh) {
                this.hoveredCard = mesh;
                this.renderer.domElement.style.cursor = 'pointer';
                // Show detail overlay on hover
                this.onCardSelect(mesh.userData.project);
            }
        } else {
            if (this.hoveredCard) {
                this.hoveredCard = null;
                this.renderer.domElement.style.cursor = 'auto';
                // Hide detail overlay
                this.onCardSelect(null);
            }
        }
    }

    _onClick() {
        // No click-to-select behavior — detail shows on hover
    }

    _onResize() {
        const w = this.container.clientWidth;
        const h = this.container.clientHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }

    _onWheel(e) {
        if (e.deltaY > 0) {
            this.scrollAccum += e.deltaY;
            const p = Math.min(this.scrollAccum / 250, 1);
            this.camera.position.z = this.homeZ - p * (this.RADIUS * 0.6);
            if (p >= 1) {
                this.onScrollAbout();
                this.scrollAccum = 0;
            }
        } else {
            this.scrollAccum = Math.max(0, this.scrollAccum + e.deltaY);
            const p = Math.min(this.scrollAccum / 250, 1);
            this.camera.position.z = this.homeZ - p * (this.RADIUS * 0.6);
        }
    }

    // ── Card deselection (called by ThreeCanvas on stage change) ──
    deselectCard() {
        this.hoveredCard = null;
        this.onCardSelect(null);
    }

    // ── Show/hide scene (for landing blur state) ──
    setVisible(visible) {
        this.renderer.domElement.style.opacity = visible ? '1' : '0.3';
        this.renderer.domElement.style.filter = visible ? 'none' : 'blur(40px) scale(1.05)';
        this.renderer.domElement.style.transition = 'all 0.7s ease';
    }

    // ── Animation loop ──
    _animate() {
        if (this.disposed) return;
        requestAnimationFrame(() => this._animate());

        // Auto-rotation
        this.worldGroup.rotation.y += 0.0003;

        // Infinity symbol counter-rotates to always face camera
        if (this.infinityGroup) {
            this.infinityGroup.rotation.y = this.camera.rotation.y + Math.PI;
        }

        // Scroll CREATING texture
        if (this.creatingTexture) {
            this.creatingTexture.offset.x += 0.0003;
        }

        // Hover Z-approach
        this.cards.forEach(card => {
            const target = (card === this.hoveredCard) ? 0.25 : 0;
            card.userData.hoverZ = THREE.MathUtils.lerp(card.userData.hoverZ, target, 0.08);
            const orig = card.userData.origPos;
            const dir = orig.clone().normalize().multiplyScalar(-card.userData.hoverZ);
            card.position.copy(orig).add(dir);
        });

        this.controls.update();
        this.camera.lookAt(0, 0, 0);
        this.renderer.render(this.scene, this.camera);
    }

    // ── Cleanup ──
    dispose() {
        this.disposed = true;
        this.renderer.domElement.removeEventListener('pointermove', this._onMoveHandler);
        this.renderer.domElement.removeEventListener('click', this._onClickHandler);
        window.removeEventListener('resize', this._onResizeHandler);
        window.removeEventListener('wheel', this._onWheelHandler);
        this.controls.dispose();
        this.renderer.dispose();
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
    }
}
