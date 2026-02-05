/**
 * KEVLAR 3D SUPREMACY - ELITE EDITION
 * ============================================
 * Features:
 * - Full 3D background with spider web & armor
 * - RGB glowing buttons with spider web click effects
 * - 360° rotatable 3D background (drag with mouse)
 * - 3D camera model in dynamics panel
 * - Ultra-premium animations
 */

// ============================================
// Global State
// ============================================
const state = {
    isLoading: true,
    isAuthenticated: false,
    armorOpen: false,
    gestureMode: false,
    comparisonOpen: false,
    timelineOpen: false,
    mousePos: { x: 0, y: 0 },
    fps: 60,
    lastFrameTime: performance.now(),
    frameCount: 0
};

// ============================================
// Three.js Scene References
// ============================================
let scene, camera, renderer, controls;
let fiberGroup, webGroup, armorGroup, armorLayers = [];
let particles, geometricGroup;
let kevlarScene, kevlarCamera, kevlarRenderer;
let steelScene, steelCamera, steelRenderer;
let kevlarModel, steelModel;
let cameraModelScene, cameraModelCam, cameraModelRenderer, camera3DModel;

// ============================================
// DOM Elements
// ============================================
const elements = {};

// ============================================
// Initialize on DOM Ready
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initElements();
    initMainScene();
    initEventListeners();
    initButtonEffects();

    // Hide loading screen after everything loads
    setTimeout(() => {
        elements.loadingScreen.classList.add('hidden');
        state.isLoading = false;
        animateCounters();
    }, 2500);
});

// ============================================
// Initialize DOM Elements
// ============================================
function initElements() {
    elements.loadingScreen = document.getElementById('loading-screen');
    elements.securityPanel = document.getElementById('security-panel');
    elements.dynamicsPanel = document.getElementById('dynamics-panel');
    elements.gestureNotification = document.getElementById('gesture-notification');
    elements.passwordInput = document.getElementById('password-input');
    elements.unlockBtn = document.getElementById('unlock-btn');
    elements.securityError = document.getElementById('security-error');
    elements.armorToggleBtn = document.getElementById('armor-toggle-btn');
    elements.gestureToggleBtn = document.getElementById('gesture-toggle-btn');
    elements.compareBtn = document.getElementById('compare-btn');
    elements.comparisonSection = document.getElementById('comparison-section');
    elements.closeComparisonBtn = document.getElementById('close-comparison-btn');
    elements.ctaArmorBtn = document.getElementById('cta-armor-btn');
    elements.eliteAccessBtn = document.getElementById('elite-access-btn');
    elements.fullscreenBtn = document.getElementById('fullscreen-btn');
    elements.mainCanvas = document.getElementById('main-canvas');
    elements.kevlarCanvas = document.getElementById('kevlar-canvas');
    elements.steelCanvas = document.getElementById('steel-canvas');
    elements.cameraModelCanvas = document.getElementById('camera-3d-model');
    elements.spiderEffectContainer = document.getElementById('spider-effect-container');
    // Timeline elements
    elements.timelineBtn = document.getElementById('timeline-btn');
    elements.timelineSection = document.getElementById('timeline-section');
    elements.closeTimelineBtn = document.getElementById('close-timeline-btn');
    elements.timelineCanvas = document.getElementById('timeline-canvas');
}

// ============================================
// Event Listeners
// ============================================
function initEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', (e) => {
        state.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
        state.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // Window resize
    window.addEventListener('resize', handleResize);

    // Button actions
    if (elements.armorToggleBtn) {
        elements.armorToggleBtn.addEventListener('click', toggleArmor);
    }

    if (elements.ctaArmorBtn) {
        elements.ctaArmorBtn.addEventListener('click', toggleArmor);
    }

    if (elements.gestureToggleBtn) {
        elements.gestureToggleBtn.addEventListener('click', toggleGestureMode);
    }

    if (elements.compareBtn) {
        elements.compareBtn.addEventListener('click', toggleComparison);
    }

    if (elements.closeComparisonBtn) {
        elements.closeComparisonBtn.addEventListener('click', toggleComparison);
    }

    if (elements.eliteAccessBtn) {
        elements.eliteAccessBtn.addEventListener('click', showSecurityPanel);
    }

    if (elements.unlockBtn) {
        elements.unlockBtn.addEventListener('click', handlePasswordSubmit);
    }

    if (elements.passwordInput) {
        elements.passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handlePasswordSubmit();
        });
    }

    if (elements.fullscreenBtn) {
        elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    }

    // Timeline button events
    if (elements.timelineBtn) {
        elements.timelineBtn.addEventListener('click', toggleTimeline);
    }

    if (elements.closeTimelineBtn) {
        elements.closeTimelineBtn.addEventListener('click', toggleTimeline);
    }
}

// ============================================
// RGB Button Effects - Spider Web Click
// ============================================
function initButtonEffects() {
    const buttons = document.querySelectorAll('.rgb-glow-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            createSpiderWebEffect(e.clientX, e.clientY);
            createParticleExplosion(btn);
        });
    });
}

// ============================================
// 3D Spider Web Click Effect
// ============================================
function createSpiderWebEffect(x, y) {
    const container = elements.spiderEffectContainer;

    const webWrapper = document.createElement('div');
    webWrapper.className = 'spider-web-effect';
    webWrapper.style.left = x + 'px';
    webWrapper.style.top = y + 'px';

    // Create SVG spider web
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');

    // Add Cosmic gradient
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    gradient.setAttribute('id', 'rgbGradient');
    gradient.innerHTML = `
        <stop offset="0%" style="stop-color:#7b68ee"/>
        <stop offset="25%" style="stop-color:#e8c547"/>
        <stop offset="50%" style="stop-color:#64d2ff"/>
        <stop offset="75%" style="stop-color:#9d7cbf"/>
        <stop offset="100%" style="stop-color:#7b68ee"/>
    `;
    defs.appendChild(gradient);
    svg.appendChild(defs);

    // Draw radial lines
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '100');
        line.setAttribute('y1', '100');
        line.setAttribute('x2', 100 + Math.cos(angle) * 100);
        line.setAttribute('y2', 100 + Math.sin(angle) * 100);
        line.setAttribute('class', 'web-line');
        svg.appendChild(line);
    }

    // Draw circular lines
    for (let r = 20; r <= 100; r += 20) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '100');
        circle.setAttribute('cy', '100');
        circle.setAttribute('r', r);
        circle.setAttribute('class', 'web-line');
        svg.appendChild(circle);
    }

    webWrapper.appendChild(svg);
    container.appendChild(webWrapper);

    // Remove after animation
    setTimeout(() => webWrapper.remove(), 800);
}

// ============================================
// Particle Explosion Effect
// ============================================
function createParticleExplosion(button) {
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#7b68ee', '#e8c547', '#64d2ff', '#9d7cbf', '#7b68ee'];

    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('span');
        const color = colors[i % colors.length];

        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            left: ${centerX}px;
            top: ${centerY}px;
            box-shadow: 0 0 15px ${color}, 0 0 30px ${color};
        `;
        document.body.appendChild(particle);

        const angle = (i / 30) * Math.PI * 2;
        const velocity = 150 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;

        let posX = centerX;
        let posY = centerY;
        let opacity = 1;
        let scale = 1;

        const animate = () => {
            posX += vx * 0.016;
            posY += vy * 0.016;
            opacity -= 0.025;
            scale -= 0.015;

            particle.style.left = `${posX}px`;
            particle.style.top = `${posY}px`;
            particle.style.opacity = opacity;
            particle.style.transform = `scale(${Math.max(0, scale)})`;

            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };

        requestAnimationFrame(animate);
    }
}

// ============================================
// Security System
// ============================================
const PASSWORD = '1234';

function showSecurityPanel() {
    elements.securityPanel.classList.remove('hidden');
    elements.passwordInput.focus();
    createSpiderWebEffect(window.innerWidth / 2, window.innerHeight / 2);
}

function handlePasswordSubmit() {
    const password = elements.passwordInput.value;

    if (password === PASSWORD) {
        state.isAuthenticated = true;
        elements.securityError.classList.add('hidden');

        // Success animation
        elements.securityPanel.style.animation = 'slideOut 0.5s ease-out forwards';
        createParticleExplosion(elements.unlockBtn);

        setTimeout(() => {
            elements.securityPanel.classList.add('hidden');
            elements.dynamicsPanel.classList.remove('hidden');
            initCameraModel();
        }, 500);
    } else {
        elements.securityError.classList.remove('hidden');
        elements.securityError.textContent = 'ACCESS DENIED - INVALID CODE';
        elements.passwordInput.style.animation = 'shake 0.5s';
        elements.passwordInput.style.borderColor = '#ff4444';

        setTimeout(() => {
            elements.passwordInput.style.animation = '';
            elements.passwordInput.style.borderColor = '';
        }, 500);
    }
}

// ============================================
// 3D Camera Model for Dynamics Panel
// ============================================
function initCameraModel() {
    if (!elements.cameraModelCanvas) return;

    const THREE = window.THREE;

    cameraModelScene = new THREE.Scene();
    cameraModelScene.background = new THREE.Color(0x050505);

    cameraModelCam = new THREE.PerspectiveCamera(50, elements.cameraModelCanvas.offsetWidth / 80, 0.1, 100);
    cameraModelCam.position.z = 4;

    cameraModelRenderer = new THREE.WebGLRenderer({
        canvas: elements.cameraModelCanvas,
        antialias: true
    });
    cameraModelRenderer.setSize(elements.cameraModelCanvas.offsetWidth, 80);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    cameraModelScene.add(ambient);
    const point = new THREE.PointLight(0xffd700, 2, 100);
    point.position.set(5, 5, 5);
    cameraModelScene.add(point);

    // Create camera model
    camera3DModel = new THREE.Group();

    // Camera body
    const bodyGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.6);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x1a1a1a,
        metalness: 0.9,
        roughness: 0.2,
        emissive: 0xffd700,
        emissiveIntensity: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    camera3DModel.add(body);

    // Camera lens
    const lensGeometry = new THREE.CylinderGeometry(0.35, 0.4, 0.8, 32);
    const lensMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0a0a0a,
        metalness: 0.95,
        roughness: 0.1,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.2
    });
    const lens = new THREE.Mesh(lensGeometry, lensMaterial);
    lens.rotation.z = Math.PI / 2;
    lens.position.x = 1.1;
    camera3DModel.add(lens);

    // Lens glass
    const glassGeometry = new THREE.CircleGeometry(0.3, 32);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffcc,
        metalness: 0.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.6,
        emissive: 0x00ffcc,
        emissiveIntensity: 0.5
    });
    const glass = new THREE.Mesh(glassGeometry, glassMaterial);
    glass.position.x = 1.5;
    glass.rotation.y = Math.PI / 2;
    camera3DModel.add(glass);

    // Viewfinder
    const vfGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.2);
    const viewfinder = new THREE.Mesh(vfGeometry, bodyMaterial);
    viewfinder.position.set(-0.3, 0.55, 0);
    camera3DModel.add(viewfinder);

    // Flash
    const flashGeometry = new THREE.BoxGeometry(0.2, 0.15, 0.15);
    const flashMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        emissive: 0xffd700,
        emissiveIntensity: 0.5
    });
    const flash = new THREE.Mesh(flashGeometry, flashMaterial);
    flash.position.set(0.5, 0.5, 0);
    camera3DModel.add(flash);

    cameraModelScene.add(camera3DModel);

    // Animation loop
    function animateCameraModel() {
        requestAnimationFrame(animateCameraModel);
        camera3DModel.rotation.y += 0.02;
        camera3DModel.rotation.x = Math.sin(performance.now() * 0.001) * 0.2;
        cameraModelRenderer.render(cameraModelScene, cameraModelCam);
    }
    animateCameraModel();
}

// ============================================
// Gesture Mode Toggle
// ============================================
function toggleGestureMode() {
    state.gestureMode = !state.gestureMode;

    if (state.gestureMode) {
        controls.enabled = true;
        elements.gestureToggleBtn.classList.add('active');
        elements.gestureToggleBtn.querySelector('.btn-text').textContent = 'GESTURE: ON';
        elements.gestureNotification.classList.remove('hidden');
        document.getElementById('gesture-status').textContent = 'ON';

        // Hide notification after 3 seconds
        setTimeout(() => {
            elements.gestureNotification.classList.add('hidden');
        }, 3000);
    } else {
        controls.enabled = false;
        elements.gestureToggleBtn.classList.remove('active');
        elements.gestureToggleBtn.querySelector('.btn-text').textContent = 'FREE GESTURE';
        document.getElementById('gesture-status').textContent = 'OFF';
    }

    createSpiderWebEffect(window.innerWidth / 2, window.innerHeight / 2);
}

// ============================================
// Armor Toggle
// ============================================
function toggleArmor() {
    state.armorOpen = !state.armorOpen;

    const btnText = state.armorOpen ? 'CLOSE ARMOR LAYERS' : 'OPEN ARMOR LAYERS';

    // Update all armor buttons
    [elements.armorToggleBtn, elements.ctaArmorBtn].forEach(btn => {
        if (btn) {
            btn.querySelector('.btn-text').textContent = btnText;
            if (state.armorOpen) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
    });

    // Update status display
    const armorStatus = document.getElementById('armor-status');
    if (armorStatus) {
        armorStatus.textContent = state.armorOpen ? 'OPEN' : 'CLOSED';
    }
}

// ============================================
// Comparison Toggle
// ============================================
function toggleComparison() {
    state.comparisonOpen = !state.comparisonOpen;

    if (state.comparisonOpen) {
        elements.comparisonSection.classList.remove('hidden');
        initComparisonScenes();

        // Smooth scroll to comparison
        setTimeout(() => {
            elements.comparisonSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        elements.comparisonSection.classList.add('hidden');
    }
}

// ============================================
// Timeline Toggle
// ============================================
let timelineScene, timelineCamera, timelineRenderer;
let timelineGroup, timelineYearMarkers = [];

function toggleTimeline() {
    state.timelineOpen = !state.timelineOpen;

    if (state.timelineOpen) {
        elements.timelineSection.classList.remove('hidden');
        initTimelineScene();
        createSpiderWebEffect(window.innerWidth / 2, window.innerHeight / 2);

        // Smooth scroll to timeline
        setTimeout(() => {
            elements.timelineSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        elements.timelineSection.classList.add('hidden');
    }
}

// ============================================
// 3D Timeline Scene
// ============================================
function initTimelineScene() {
    if (timelineScene) return; // Already initialized

    const THREE = window.THREE;
    const canvas = elements.timelineCanvas;
    if (!canvas) return;

    // Scene
    timelineScene = new THREE.Scene();
    timelineScene.background = new THREE.Color(0x050505);

    // Camera
    timelineCamera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / 300, 0.1, 1000);
    timelineCamera.position.set(0, 5, 25);
    timelineCamera.lookAt(0, 0, 0);

    // Renderer
    timelineRenderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    timelineRenderer.setSize(canvas.offsetWidth, 300);
    timelineRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffd700, 0.4);
    timelineScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffd700, 2, 100);
    pointLight1.position.set(20, 10, 10);
    timelineScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffcc, 1.5, 100);
    pointLight2.position.set(-20, -10, 10);
    timelineScene.add(pointLight2);

    // Create timeline group
    timelineGroup = new THREE.Group();

    // Timeline years
    const years = [1965, 1971, 1975, 1988, 2024];
    const yearPositions = [-12, -6, 0, 6, 12];

    // Create year markers (spheres with rings)
    years.forEach((year, i) => {
        const markerGroup = new THREE.Group();

        // Main sphere
        const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
        const sphereMaterial = new THREE.MeshPhysicalMaterial({
            color: i % 2 === 0 ? 0xffd700 : 0x00ffcc,
            metalness: 0.9,
            roughness: 0.1,
            emissive: i % 2 === 0 ? 0xffd700 : 0x00ffcc,
            emissiveIntensity: 0.5
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        markerGroup.add(sphere);

        // Orbital ring around sphere
        const ringGeometry = new THREE.TorusGeometry(1.2, 0.05, 16, 50);
        const ringMaterial = new THREE.MeshPhysicalMaterial({
            color: i % 2 === 0 ? 0x00ffcc : 0xffd700,
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.7,
            emissive: i % 2 === 0 ? 0x00ffcc : 0xffd700,
            emissiveIntensity: 0.3
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2;
        markerGroup.add(ring);

        // Position marker
        markerGroup.position.x = yearPositions[i];
        markerGroup.userData = { year, baseY: 0, index: i, ring };

        timelineGroup.add(markerGroup);
        timelineYearMarkers.push(markerGroup);
    });

    // Connecting line between markers
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = new Float32Array([
        yearPositions[0], 0, 0,
        yearPositions[yearPositions.length - 1], 0, 0
    ]);
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffd700,
        transparent: true,
        opacity: 0.6
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    timelineGroup.add(line);

    // Add decorative outer rings
    for (let i = 0; i < 3; i++) {
        const bigRingGeometry = new THREE.TorusGeometry(15 + i * 3, 0.03, 16, 100);
        const bigRingMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(i * 0.3, 1, 0.5),
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.3,
            emissive: new THREE.Color().setHSL(i * 0.3, 1, 0.5),
            emissiveIntensity: 0.4
        });
        const bigRing = new THREE.Mesh(bigRingGeometry, bigRingMaterial);
        bigRing.rotation.x = Math.PI / 2 + (i * 0.15);
        bigRing.rotation.z = i * 0.2;
        bigRing.userData = { rotationSpeed: 0.002 * (i + 1) };
        timelineGroup.add(bigRing);
    }

    // Add particles
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 50;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;

        const color = Math.random() > 0.5 ? new THREE.Color(0xffd700) : new THREE.Color(0x00ffcc);
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    const timelineParticles = new THREE.Points(particlesGeometry, particleMaterial);
    timelineGroup.add(timelineParticles);

    timelineScene.add(timelineGroup);

    // Animation loop
    function animateTimeline() {
        if (!state.timelineOpen) return;
        requestAnimationFrame(animateTimeline);

        const time = performance.now() * 0.001;

        // Animate year markers
        timelineYearMarkers.forEach((marker, i) => {
            marker.position.y = Math.sin(time * 1.5 + i * 0.5) * 0.5;
            marker.rotation.y += 0.01;
            if (marker.userData.ring) {
                marker.userData.ring.rotation.z += 0.02;
            }
            // Pulsing glow
            const sphere = marker.children[0];
            if (sphere && sphere.material) {
                sphere.material.emissiveIntensity = 0.5 + Math.sin(time * 3 + i) * 0.2;
            }
        });

        // Animate outer rings
        timelineGroup.children.forEach(child => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.z += child.userData.rotationSpeed;
            }
        });

        // Rotate entire group slightly
        timelineGroup.rotation.y = Math.sin(time * 0.2) * 0.1;

        // Update year display
        const yearDisplay = document.getElementById('timeline-year-display');
        if (yearDisplay) {
            const currentYear = 1965 + Math.floor((Math.sin(time * 0.5) + 1) * 0.5 * 59);
            yearDisplay.textContent = currentYear;
        }

        timelineRenderer.render(timelineScene, timelineCamera);
    }

    animateTimeline();
}

// ============================================
// Fullscreen Toggle
// ============================================
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ============================================
// Handle Window Resize
// ============================================
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ============================================
// Main 3D Scene Initialization
// ============================================
function initMainScene() {
    const THREE = window.THREE;
    const canvas = elements.mainCanvas;

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 15, 80);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // OrbitControls - DISABLED by default, enabled via FREE GESTURE button
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enabled = false; // Disabled until FREE GESTURE activated
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 100;
    controls.enablePan = true;
    controls.autoRotate = true; // Auto rotate for dynamic effect
    controls.autoRotateSpeed = 0.3;
    // Use RIGHT mouse button for rotation (more intuitive)
    controls.mouseButtons = {
        LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE
    };

    // Lighting Setup
    setupLighting(scene, THREE);

    // Create 3D Elements
    createCentralHexagonPortal(scene, THREE); // NEW: Central glowing hexagon portal
    createKevlarFibers(scene, THREE);
    createRealisticSpiderWeb(scene, THREE);
    createRealisticArmor(scene, THREE);
    createParticleSystem(scene, THREE);
    createGeometricRings(scene, THREE);
    createBackgroundStars(scene, THREE);

    // Start Animation
    animateMainScene();
}

// ============================================
// Lighting Setup
// ============================================
function setupLighting(targetScene, THREE) {
    const ambientLight = new THREE.AmbientLight(0xffd700, 0.3);
    targetScene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xffd700, 2, 150);
    pointLight1.position.set(15, 15, 15);
    targetScene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffcc, 1.5, 150);
    pointLight2.position.set(-15, -15, 15);
    targetScene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x7b68ee, 0.8, 100);
    pointLight3.position.set(0, 0, -20);
    targetScene.add(pointLight3);

    const spotLight = new THREE.SpotLight(0xffd700, 2.5);
    spotLight.position.set(0, 30, 30);
    spotLight.angle = Math.PI / 5;
    spotLight.penumbra = 0.5;
    targetScene.add(spotLight);
}

// ============================================
// Central Hexagon Portal - Futuristic Background
// ============================================
let hexagonPortalGroup;

function createCentralHexagonPortal(targetScene, THREE) {
    hexagonPortalGroup = new THREE.Group();

    // ===== KEVLAR WOVEN FIBER BACKGROUND =====
    // Create realistic golden aramid fiber weave pattern

    const kevlarGold = 0xe8c547;
    const kevlarDarkGold = 0xc9a227;

    // Kevlar fiber material - shiny metallic aramid look
    const fiberMaterial = new THREE.MeshPhysicalMaterial({
        color: kevlarGold,
        metalness: 0.85,
        roughness: 0.15,
        transparent: true,
        opacity: 0.95,
        emissive: kevlarGold,
        emissiveIntensity: 0.15
    });

    const fiberDarkMaterial = new THREE.MeshPhysicalMaterial({
        color: kevlarDarkGold,
        metalness: 0.9,
        roughness: 0.2,
        transparent: true,
        opacity: 0.9,
        emissive: kevlarDarkGold,
        emissiveIntensity: 0.1
    });

    // Create woven pattern - horizontal fibers
    const fiberWidth = 0.3;
    const fiberSpacing = 0.8;
    const gridSize = 25;

    for (let i = -gridSize; i <= gridSize; i++) {
        // Horizontal fibers
        const hGeometry = new THREE.BoxGeometry(gridSize * 2 * fiberSpacing, fiberWidth * 0.5, fiberWidth);
        const hFiber = new THREE.Mesh(hGeometry, i % 2 === 0 ? fiberMaterial.clone() : fiberDarkMaterial.clone());
        hFiber.position.y = i * fiberSpacing;
        hFiber.position.z = (i % 2) * fiberWidth * 0.3; // Weave offset
        hexagonPortalGroup.add(hFiber);

        // Vertical fibers (weaving over/under)
        const vGeometry = new THREE.BoxGeometry(fiberWidth, fiberSpacing * 2, fiberWidth * 0.5);
        for (let j = -gridSize; j <= gridSize; j++) {
            const vFiber = new THREE.Mesh(vGeometry, j % 2 === 0 ? fiberDarkMaterial.clone() : fiberMaterial.clone());
            vFiber.position.x = j * fiberSpacing;
            vFiber.position.y = i * fiberSpacing + fiberSpacing;
            vFiber.position.z = ((i + j) % 2) * fiberWidth * 0.3 - fiberWidth * 0.15;
            hexagonPortalGroup.add(vFiber);
        }
    }

    // Add glowing edge frame
    const frameMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00ffff,
        metalness: 1,
        roughness: 0,
        transparent: true,
        opacity: 0.8,
        emissive: 0x00ffff,
        emissiveIntensity: 0.6
    });

    // Central glowing hexagon overlay
    const hexShape = new THREE.Shape();
    const hexRadius = 8;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
        const x = Math.cos(angle) * hexRadius;
        const y = Math.sin(angle) * hexRadius;
        if (i === 0) hexShape.moveTo(x, y);
        else hexShape.lineTo(x, y);
    }
    hexShape.closePath();

    // Glowing hexagon outline
    for (let ring = 0; ring < 3; ring++) {
        const ringShape = new THREE.Shape();
        const ringRadius = hexRadius + ring * 3;
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const x = Math.cos(angle) * ringRadius;
            const y = Math.sin(angle) * ringRadius;
            if (i === 0) ringShape.moveTo(x, y);
            else ringShape.lineTo(x, y);
        }

        const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringShape.getPoints());
        const ringColor = ring === 0 ? 0x00ffff : (ring === 1 ? 0xe8c547 : 0x7b68ee);
        const ringMaterial = new THREE.LineBasicMaterial({
            color: ringColor,
            transparent: true,
            opacity: 0.7 - ring * 0.2
        });
        const ringMesh = new THREE.LineLoop(ringGeometry, ringMaterial);
        ringMesh.position.z = 5;
        hexagonPortalGroup.add(ringMesh);
    }

    // Central glowing orb
    const orbGeometry = new THREE.SphereGeometry(2, 32, 32);
    const orbMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
        emissive: 0xe8c547,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.1
    });
    const orb = new THREE.Mesh(orbGeometry, orbMaterial);
    orb.position.z = 8;
    hexagonPortalGroup.add(orb);

    // Orbital rings around orb
    for (let i = 0; i < 3; i++) {
        const torusGeometry = new THREE.TorusGeometry(3 + i * 1.2, 0.05, 16, 100);
        const torusColor = i === 0 ? 0x00ffff : (i === 1 ? 0xe8c547 : 0xff6600);
        const torusMaterial = new THREE.MeshPhysicalMaterial({
            color: torusColor,
            transparent: true,
            opacity: 0.7,
            emissive: torusColor,
            emissiveIntensity: 0.5
        });
        const torus = new THREE.Mesh(torusGeometry, torusMaterial);
        torus.position.z = 8;
        torus.rotation.x = Math.PI / 2 + i * 0.3;
        torus.rotation.z = i * 0.5;
        torus.userData = { rotationSpeed: 0.01 * (i + 1) };
        hexagonPortalGroup.add(torus);
    }

    // Position in background
    hexagonPortalGroup.position.z = -25;
    hexagonPortalGroup.rotation.x = 0.1;
    targetScene.add(hexagonPortalGroup);
}

// ============================================
// Background Stars
// ============================================
function createBackgroundStars(targetScene, THREE) {
    const starCount = 1000;
    const starsGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 200;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8
    });

    const stars = new THREE.Points(starsGeometry, starMaterial);
    targetScene.add(stars);
}

// ============================================
// Realistic Kevlar Fiber Creation
// ============================================
function createKevlarFibers(targetScene, THREE) {
    fiberGroup = new THREE.Group();

    // Main fiber material with realistic properties
    const fiberMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe8c547,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.85,
        emissive: 0xe8c547,
        emissiveIntensity: 0.25
    });

    // Create double helix structure (like DNA but for Kevlar)
    for (let strand = 0; strand < 2; strand++) {
        for (let i = 0; i < 50; i++) {
            const geometry = new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8);
            const fiber = new THREE.Mesh(geometry, fiberMaterial.clone());

            const angle = (i / 50) * Math.PI * 6 + (strand * Math.PI);
            const radius = 2.5;
            fiber.position.x = Math.cos(angle) * radius;
            fiber.position.y = (i / 50) * 16 - 8;
            fiber.position.z = Math.sin(angle) * radius;

            // Add end caps (spheres)
            const capGeometry = new THREE.SphereGeometry(0.08, 8, 8);
            const topCap = new THREE.Mesh(capGeometry, fiberMaterial.clone());
            topCap.position.y = 0.3;
            fiber.add(topCap);

            const bottomCap = new THREE.Mesh(capGeometry, fiberMaterial.clone());
            bottomCap.position.y = -0.3;
            fiber.add(bottomCap);

            // Align fiber tangent to helix
            const nextAngle = ((i + 1) / 50) * Math.PI * 6 + (strand * Math.PI);
            fiber.lookAt(
                Math.cos(nextAngle) * radius,
                ((i + 1) / 50) * 16 - 8,
                Math.sin(nextAngle) * radius
            );

            fiber.userData = {
                index: i,
                strand: strand,
                baseY: fiber.position.y,
                phase: i * 0.2 + strand * Math.PI
            };

            fiberGroup.add(fiber);
        }
    }

    // Add connecting cross-fibers (hydrogen bonds visualization)
    const bondMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x64d2ff,
        metalness: 0.5,
        roughness: 0.3,
        transparent: true,
        opacity: 0.35,
        emissive: 0x64d2ff,
        emissiveIntensity: 0.15
    });

    for (let i = 0; i < 25; i++) {
        const bondGeometry = new THREE.CylinderGeometry(0.02, 0.02, 5, 8);
        const bond = new THREE.Mesh(bondGeometry, bondMaterial);

        const y = (i / 25) * 16 - 8;
        bond.position.y = y;
        bond.rotation.z = Math.PI / 2;
        bond.rotation.y = (i / 25) * Math.PI * 6;

        bond.userData = { index: i, baseOpacity: 0.4 };
        fiberGroup.add(bond);
    }

    targetScene.add(fiberGroup);
}

// ============================================
// Realistic 3D Spider Web
// ============================================
function createRealisticSpiderWeb(targetScene, THREE) {
    webGroup = new THREE.Group();

    const webMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x64d2ff,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
        emissive: 0x64d2ff,
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
    });

    // Create 3D radial strands with thickness
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const tubeGeometry = new THREE.CylinderGeometry(0.03, 0.03, 12, 8);
        const strand = new THREE.Mesh(tubeGeometry, webMaterial.clone());

        strand.rotation.z = Math.PI / 2;
        strand.rotation.y = angle;
        strand.position.x = Math.cos(angle) * 6;
        strand.position.y = Math.sin(angle) * 6;

        strand.userData = { index: i, type: 'radial' };
        webGroup.add(strand);
    }

    // Create 3D circular rings
    for (let r = 1; r <= 8; r++) {
        const radius = r * 1.5;
        const torusGeometry = new THREE.TorusGeometry(radius, 0.02, 8, 64);
        const ring = new THREE.Mesh(torusGeometry, webMaterial.clone());

        ring.userData = { index: r, type: 'circular' };
        webGroup.add(ring);
    }

    // Add glowing center node
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const centerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xe8c547,
        emissive: 0xe8c547,
        emissiveIntensity: 0.6,
        metalness: 1,
        roughness: 0
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    webGroup.add(center);

    webGroup.position.z = -8;
    webGroup.scale.set(0.8, 0.8, 0.8);
    targetScene.add(webGroup);
}

// ============================================
// Realistic 3D Armor
// ============================================
function createRealisticArmor(targetScene, THREE) {
    armorGroup = new THREE.Group();
    armorLayers = [];

    for (let layer = 0; layer < 5; layer++) {
        const layerGroup = new THREE.Group();

        // Create hexagonal shape
        const hexShape = new THREE.Shape();
        const hexRadius = 3 - layer * 0.3;

        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const x = Math.cos(angle) * hexRadius;
            const y = Math.sin(angle) * hexRadius;
            if (i === 0) hexShape.moveTo(x, y);
            else hexShape.lineTo(x, y);
        }
        hexShape.closePath();

        const extrudeSettings = {
            depth: 0.4,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.1,
            bevelSegments: 6
        };

        const geometry = new THREE.ExtrudeGeometry(hexShape, extrudeSettings);

        // Create realistic armor material with RGB touch
        const hue = (layer / 5) * 0.1;
        const material = new THREE.MeshPhysicalMaterial({
            color: layer % 2 === 0 ? 0x1a1a1a : 0x2a2a2a,
            metalness: 0.98,
            roughness: 0.1,
            transparent: true,
            opacity: 0.95,
            emissive: new THREE.Color().setHSL(hue + 0.1, 1, 0.3),
            emissiveIntensity: 0.15,
            side: THREE.DoubleSide
        });

        const plate = new THREE.Mesh(geometry, material);
        plate.position.z = layer * 0.5;

        // Add glowing edges
        const edges = new THREE.EdgesGeometry(geometry);
        const edgeMaterial = new THREE.LineBasicMaterial({
            color: layer % 2 === 0 ? 0xe8c547 : 0x64d2ff,
            transparent: true,
            opacity: 0.8
        });
        const edgeLine = new THREE.LineSegments(edges, edgeMaterial);
        plate.add(edgeLine);

        // Add inner hexagonal detail
        const innerHexRadius = hexRadius * 0.55;
        const innerShape = new THREE.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const x = Math.cos(angle) * innerHexRadius;
            const y = Math.sin(angle) * innerHexRadius;
            if (i === 0) innerShape.moveTo(x, y);
            else innerShape.lineTo(x, y);
        }
        innerShape.closePath();

        const innerGeometry = new THREE.ExtrudeGeometry(innerShape, { depth: 0.2, bevelEnabled: false });
        const innerMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x0a0a0a,
            metalness: 0.9,
            roughness: 0.15,
            transparent: true,
            opacity: 0.9,
            emissive: 0xffd700,
            emissiveIntensity: 0.1
        });
        const innerPlate = new THREE.Mesh(innerGeometry, innerMaterial);
        innerPlate.position.z = 0.2;
        plate.add(innerPlate);

        layerGroup.add(plate);
        layerGroup.userData = {
            layer,
            baseZ: layer * 0.5,
            targetZ: layer * 0.5,
            targetRotation: 0
        };

        armorLayers.push(layerGroup);
        armorGroup.add(layerGroup);
    }

    armorGroup.position.x = 6;
    targetScene.add(armorGroup);
}

// ============================================
// Particle System
// ============================================
function createParticleSystem(targetScene, THREE) {
    const particleCount = 2000;
    const particlesGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    const colors = [
        new THREE.Color(0xe8c547),
        new THREE.Color(0x64d2ff),
        new THREE.Color(0x7b68ee),
        new THREE.Color(0x9d7cbf)
    ];

    for (let i = 0; i < particleCount; i++) {
        particlePositions[i * 3] = (Math.random() - 0.5) * 80;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 80;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 80;

        const color = colors[Math.floor(Math.random() * colors.length)];
        particleColors[i * 3] = color.r;
        particleColors[i * 3 + 1] = color.g;
        particleColors[i * 3 + 2] = color.b;

        particleVelocities.push({
            x: (Math.random() - 0.5) * 0.03,
            y: (Math.random() - 0.5) * 0.03,
            z: (Math.random() - 0.5) * 0.03
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        transparent: true,
        opacity: 0.7,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particleMaterial);
    particles.userData = { velocities: particleVelocities };
    targetScene.add(particles);
}

// ============================================
// Geometric Rings
// ============================================
function createGeometricRings(targetScene, THREE) {
    geometricGroup = new THREE.Group();

    for (let i = 0; i < 5; i++) {
        const ringGeometry = new THREE.TorusGeometry(5 + i * 2, 0.08, 16, 100);
        const hue = i / 5;
        const ringMaterial = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color().setHSL(hue, 1, 0.5),
            metalness: 1,
            roughness: 0,
            transparent: true,
            opacity: 0.4,
            emissive: new THREE.Color().setHSL(hue, 1, 0.5),
            emissiveIntensity: 0.6
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + (i * 0.1);
        ring.rotation.z = i * 0.2;
        ring.userData = {
            rotationSpeed: 0.003 * (i + 1),
            axis: i % 3,
            hue: hue
        };

        geometricGroup.add(ring);
    }

    geometricGroup.position.z = -15;
    targetScene.add(geometricGroup);
}

// ============================================
// Main Animation Loop
// ============================================
function animateMainScene() {
    const animate = () => {
        requestAnimationFrame(animate);

        const time = performance.now() * 0.001;

        // Calculate FPS
        state.frameCount++;
        const now = performance.now();
        if (now - state.lastFrameTime >= 1000) {
            state.fps = state.frameCount;
            state.frameCount = 0;
            state.lastFrameTime = now;
        }

        // Animate fibers
        if (fiberGroup) {
            fiberGroup.children.forEach((fiber, i) => {
                if (fiber.userData.baseY !== undefined) {
                    fiber.position.y = fiber.userData.baseY + Math.sin(time * 2 + fiber.userData.phase) * 0.3;
                    if (fiber.material && fiber.material.emissiveIntensity !== undefined) {
                        fiber.material.emissiveIntensity = 0.3 + Math.sin(time * 3 + fiber.userData.phase) * 0.15;
                    }
                }
                if (fiber.userData.baseOpacity !== undefined) {
                    fiber.material.opacity = fiber.userData.baseOpacity + Math.sin(time * 2 + i) * 0.2;
                }
            });
            fiberGroup.rotation.y = time * 0.2;
        }

        // Animate web
        if (webGroup) {
            webGroup.rotation.z = time * 0.08;
            webGroup.rotation.x = Math.sin(time * 0.3) * 0.1;
            webGroup.children.forEach((line, i) => {
                if (line.material) {
                    line.material.opacity = 0.5 + Math.sin(time * 2 + i * 0.3) * 0.2;
                    if (line.material.emissiveIntensity !== undefined) {
                        line.material.emissiveIntensity = 0.3 + Math.sin(time * 3 + i) * 0.2;
                    }
                }
            });
        }

        // Animate armor layers
        if (armorLayers.length > 0) {
            armorLayers.forEach((layer, i) => {
                if (state.armorOpen) {
                    layer.userData.targetZ = layer.userData.baseZ + (i + 1) * 3;
                    layer.userData.targetRotation = time * 0.4 + i * 0.5;
                } else {
                    layer.userData.targetZ = layer.userData.baseZ;
                    layer.userData.targetRotation = 0;
                }

                // Smooth interpolation
                layer.position.z += (layer.userData.targetZ - layer.position.z) * 0.06;
                layer.rotation.z += (layer.userData.targetRotation - layer.rotation.z) * 0.06;

                // Pulsing glow with RGB shift
                const plate = layer.children[0];
                if (plate && plate.material) {
                    plate.material.emissiveIntensity = 0.15 + Math.sin(time * 3 + i) * 0.1;
                    // RGB shift
                    const hue = (time * 0.1 + i * 0.1) % 1;
                    plate.material.emissive.setHSL(hue, 1, 0.3);
                }
            });
        }

        // Animate armor group
        if (armorGroup) {
            armorGroup.rotation.y = time * 0.12;
            armorGroup.rotation.x = Math.sin(time * 0.4) * 0.15;
        }

        // Animate particles
        if (particles) {
            const positions = particles.geometry.attributes.position.array;
            const velocities = particles.userData.velocities;

            for (let i = 0; i < velocities.length; i++) {
                positions[i * 3] += velocities[i].x;
                positions[i * 3 + 1] += velocities[i].y;
                positions[i * 3 + 2] += velocities[i].z;

                if (Math.abs(positions[i * 3]) > 40) velocities[i].x *= -1;
                if (Math.abs(positions[i * 3 + 1]) > 40) velocities[i].y *= -1;
                if (Math.abs(positions[i * 3 + 2]) > 40) velocities[i].z *= -1;
            }
            particles.geometry.attributes.position.needsUpdate = true;
        }

        // Animate geometric rings with RGB
        if (geometricGroup) {
            geometricGroup.children.forEach(ring => {
                if (ring.userData.axis === 0) ring.rotation.x += ring.userData.rotationSpeed;
                if (ring.userData.axis === 1) ring.rotation.y += ring.userData.rotationSpeed;
                if (ring.userData.axis === 2) ring.rotation.z += ring.userData.rotationSpeed;

                // RGB color cycling
                const hue = (ring.userData.hue + time * 0.1) % 1;
                ring.material.color.setHSL(hue, 1, 0.5);
                ring.material.emissive.setHSL(hue, 1, 0.5);
            });
        }

        // Camera follows mouse (when not in gesture mode)
        if (!state.gestureMode) {
            camera.position.x += (state.mousePos.x * 5 - camera.position.x) * 0.03;
            camera.position.y += (state.mousePos.y * 5 - camera.position.y) * 0.03;
            camera.lookAt(scene.position);
        }

        // Update controls
        if (controls) {
            controls.update();
        }

        // Update dynamics panel
        updateDynamicsPanel();

        renderer.render(scene, camera);
    };

    animate();
}

// ============================================
// Update Dynamics Panel
// ============================================
function updateDynamicsPanel() {
    if (!state.isAuthenticated) return;

    const camX = document.getElementById('cam-x');
    const camY = document.getElementById('cam-y');
    const camZ = document.getElementById('cam-z');
    const camFov = document.getElementById('cam-fov');
    const camRot = document.getElementById('cam-rot');
    const fpsCounter = document.getElementById('fps-counter');
    const particleCount = document.getElementById('particle-count');
    const fiberCount = document.getElementById('fiber-count');

    if (camX) camX.textContent = camera.position.x.toFixed(3);
    if (camY) camY.textContent = camera.position.y.toFixed(3);
    if (camZ) camZ.textContent = camera.position.z.toFixed(3);
    if (camFov) camFov.textContent = camera.fov.toFixed(0) + '°';
    if (camRot) camRot.textContent = camera.rotation.y.toFixed(3);
    if (fpsCounter) fpsCounter.textContent = state.fps;
    if (particleCount) particleCount.textContent = '2000';
    if (fiberCount) fiberCount.textContent = '100';

    // Update hero section data
    const mouseX = document.getElementById('mouse-x');
    const mouseY = document.getElementById('mouse-y');
    if (mouseX) mouseX.textContent = state.mousePos.x.toFixed(2);
    if (mouseY) mouseY.textContent = state.mousePos.y.toFixed(2);
}

// ============================================
// Animate Counters
// ============================================
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ============================================
// Comparison Scenes (Kevlar vs Steel)
// ============================================
function initComparisonScenes() {
    if (kevlarScene) return;

    const THREE = window.THREE;

    // Kevlar Scene
    kevlarScene = new THREE.Scene();
    kevlarScene.background = new THREE.Color(0x050505);

    kevlarCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    kevlarCamera.position.z = 6;

    kevlarRenderer = new THREE.WebGLRenderer({
        canvas: elements.kevlarCanvas,
        antialias: true
    });
    kevlarRenderer.setSize(elements.kevlarCanvas.offsetWidth, 250);

    // Add lighting to Kevlar scene
    const kevlarAmbient = new THREE.AmbientLight(0xffd700, 0.5);
    kevlarScene.add(kevlarAmbient);
    const kevlarPoint = new THREE.PointLight(0xffd700, 2, 50);
    kevlarPoint.position.set(5, 5, 5);
    kevlarScene.add(kevlarPoint);

    // Create Kevlar model - woven fiber structure
    kevlarModel = new THREE.Group();

    const kevlarFiberMat = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 0.85,
        roughness: 0.15,
        emissive: 0xffd700,
        emissiveIntensity: 0.3
    });

    // Create woven pattern
    for (let x = -3; x <= 3; x++) {
        for (let y = -3; y <= 3; y++) {
            const isHorizontal = (x + y) % 2 === 0;
            const fiberGeometry = new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8);
            const fiber = new THREE.Mesh(fiberGeometry, kevlarFiberMat.clone());

            if (isHorizontal) {
                fiber.rotation.z = Math.PI / 2;
                fiber.position.set(x * 0.4, y * 0.4, Math.sin(x) * 0.1);
            } else {
                fiber.position.set(x * 0.4, y * 0.4, Math.cos(y) * 0.1);
            }

            fiber.userData = { x, y };
            kevlarModel.add(fiber);
        }
    }

    kevlarScene.add(kevlarModel);

    // Steel Scene
    steelScene = new THREE.Scene();
    steelScene.background = new THREE.Color(0x050505);

    steelCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    steelCamera.position.z = 6;

    steelRenderer = new THREE.WebGLRenderer({
        canvas: elements.steelCanvas,
        antialias: true
    });
    steelRenderer.setSize(elements.steelCanvas.offsetWidth, 250);

    // Add lighting to Steel scene
    const steelAmbient = new THREE.AmbientLight(0x666666, 0.5);
    steelScene.add(steelAmbient);
    const steelPoint = new THREE.PointLight(0xaaaaaa, 1.5, 50);
    steelPoint.position.set(5, 5, 5);
    steelScene.add(steelPoint);

    // Create Steel model - solid heavy block
    steelModel = new THREE.Group();

    const steelMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x555555,
        metalness: 0.95,
        roughness: 0.25,
        emissive: 0x333333,
        emissiveIntensity: 0.1
    });

    // Main steel block
    const blockGeometry = new THREE.BoxGeometry(2.5, 2.5, 0.8);
    const block = new THREE.Mesh(blockGeometry, steelMaterial);
    steelModel.add(block);

    // Add rivets
    const rivetGeometry = new THREE.CylinderGeometry(0.08, 0.1, 0.15, 12);
    const rivetMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x444444,
        metalness: 1,
        roughness: 0.3
    });

    const rivetPositions = [[-0.9, -0.9], [-0.9, 0.9], [0.9, -0.9], [0.9, 0.9]];
    rivetPositions.forEach(pos => {
        const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
        rivet.rotation.x = Math.PI / 2;
        rivet.position.set(pos[0], pos[1], 0.45);
        steelModel.add(rivet);
    });

    // Add scratch marks
    const scratchMaterial = new THREE.LineBasicMaterial({ color: 0x333333, transparent: true, opacity: 0.5 });
    for (let i = 0; i < 5; i++) {
        const points = [
            new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, 0.41),
            new THREE.Vector3(-1 + Math.random() * 2, -1 + Math.random() * 2, 0.41)
        ];
        const scratchGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const scratch = new THREE.Line(scratchGeometry, scratchMaterial);
        steelModel.add(scratch);
    }

    steelScene.add(steelModel);

    // Animation loop for comparison
    function animateComparison() {
        requestAnimationFrame(animateComparison);

        if (kevlarModel) {
            kevlarModel.rotation.y += 0.01;
            kevlarModel.rotation.x = Math.sin(performance.now() * 0.001) * 0.15;
        }

        if (steelModel) {
            steelModel.rotation.y += 0.008;
            steelModel.rotation.x = Math.sin(performance.now() * 0.001 + 1) * 0.1;
        }

        kevlarRenderer.render(kevlarScene, kevlarCamera);
        steelRenderer.render(steelScene, steelCamera);
    }

    animateComparison();
}
