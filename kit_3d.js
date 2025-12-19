
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

function initViewer(containerId, modelPath) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 5, 10);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.innerHTML = ''; // Clear placeholder
    container.appendChild(renderer.domElement);

    // CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // LOAD MODEL
    const loader = new GLTFLoader();
    loader.load(modelPath, (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            const scale = 8 / maxDim;
            model.scale.setScalar(scale);
        }

        scene.add(model);
    }, undefined, (error) => {
        console.error('Error loading model for', containerId, error);
    });

    // RESIZE
    const resizeObserver = new ResizeObserver(() => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

document.addEventListener('DOMContentLoaded', () => {
    // Main Weapon
    initViewer('weapon-container', 'asset/3D/arma_per_sito_(V11).glb');

    // Catalog Items
    // We need to find all catalog items and init viewers for them.
    // Assuming they have a common class for the visual container.
    // The HTML has `item-image-placeholder` class.
    // We should give them unique IDs or iterate elements.
    const catalogImages = document.querySelectorAll('.item-image-placeholder');
    catalogImages.forEach((el, index) => {
        // Assign ID if needed or just pass element (modified initViewer to accept element?)
        // Let's modify initViewer to take element or ID.
        // But for consistency with previous file:
        const uniqueId = `catalog-model-${index}`;
        el.id = uniqueId;
        // Remove pseudo-element CSS effects via inline style or class toggle?
        // The CSS has ::before content. JS renderer canvas will sit on top or inside.
        // It might conflict with CSS transforms.
        // Let's rely on the fact that appending canvas will cover.
        // We'll init the same model for now as requested: "sostituisci gli elementi ... con il file arma_per_sito_(V11).glb"
        initViewer(uniqueId, 'asset/3D/arma_per_sito_(V11).glb');
    });
});
