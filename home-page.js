import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (canvas.width !== width || canvas.height !== height) {
        renderer.setSize(width, height, false);
    }
}

resizeRendererToDisplaySize(renderer);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
camera.position.set(10, 5, 600);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;
controls.enableRotate = true;
controls.enableZoom = true;
controls.minDistance = 5;
controls.maxDistance = 300;
controls.minPolarAngle = Math.PI / 2;
controls.maxPolarAngle = Math.PI / 2;
controls.autoRotate = false;
controls.target.set(0, 1, 0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); 
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const loader = new GLTFLoader();

const backgroundParent = new THREE.Object3D();
scene.add(backgroundParent);

// Load background model
loader.load('/public/free_-_skybox_fairy_castle_night/scene.gltf', (gltf) => {
    const backgroundModel = gltf.scene;
    backgroundParent.add(backgroundModel); 

    document.getElementById('progress-container').style.display = 'none';
});

let rotateBackground = true; 

function animate() {
    requestAnimationFrame(animate);
    resizeRendererToDisplaySize(renderer);

    if (rotateBackground) {
        backgroundParent.rotation.y += 0.006;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    resizeRendererToDisplaySize(renderer);
});

window.addEventListener('click', () => {
    rotateBackground = !rotateBackground; 
});

