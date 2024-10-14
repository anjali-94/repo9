import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const popSound = document.getElementById('popSound'); 
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const box = document.getElementById('box'); 

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Create a box
const groundGeometry = new THREE.BoxGeometry(10, 3, 10); 
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x32CD32 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -1.5; 
scene.add(ground);

const holePositions = [
  [-3, 0, -3], [0, 0, -3], [3, 0, -3],
  [-3, 0, 0], [0, 0, 0], [3, 0, 0],
  [-3, 0, 3], [0, 0, 3], [3, 0, 3]
];
const holeGeometry = new THREE.CircleGeometry(0.7, 32);
const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
for (const position of holePositions) {
  const hole = new THREE.Mesh(holeGeometry, holeMaterial);
  hole.position.set(...position);
  hole.rotation.x = -Math.PI / 2;
  hole.position.y = 0.05; 
  scene.add(hole);
}

const loader = new GLTFLoader();
let monkeys = [];
let score = 0;
const monkeyDuration = 1000; 
let currentMonkey = null;

function loadMonkeyModel(position) {
  loader.load('/public/diglett.glb', function (gltf) {
    const monkey = gltf.scene;
    monkey.scale.set(4, 4, 4); 
    monkey.position.set(position[0], -100, position[2]); 
    scene.add(monkey);
    monkeys.push(monkey);
  }, undefined, function (error) {
    console.error(error);
  });
}

holePositions.forEach(position => loadMonkeyModel(position));

camera.position.z = 8;
camera.position.y = 6;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.update();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function showMonkey() {
  if (currentMonkey) {
    currentMonkey.position.y = -50; // Move it below the ground to hide
  }

  const randomIndex = Math.floor(Math.random() * holePositions.length);
  const position = holePositions[randomIndex];

  currentMonkey = monkeys[randomIndex];
  currentMonkey.position.set(position[0], 0.4, position[2]); // Raise above the ground

  setTimeout(() => {
    if (currentMonkey === monkeys[randomIndex]) {
      currentMonkey.position.y = -50; // Hide monkey after duration
      currentMonkey = null; 
    }
  }, monkeyDuration);
}

setInterval(showMonkey, 1200); 

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(monkeys, true); 

  if (intersects.length > 0) {
    popSound.currentTime = 0; 
    popSound.play();
    score++;
    updateScore();

    // Check if the score is 3
    if (score === 3) {
      setTimeout(() => {
        window.location.href = 'home-page.html'; // Change to your portfolio page
      });
    }

    const clickedMesh = intersects[0].object;  
    const monkey = monkeys.find(m => m.contains(clickedMesh)); 

    if (monkey) {
      monkey.position.y = -10; // Move the whole monkey below ground
    }

    if (monkey === currentMonkey) {
      currentMonkey = null; 
    }
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

// Adjust for screen size changes
function adjustForScreenSize() {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    camera.position.set(0, 6, 12); // Camera position for mobile
    monkeys.forEach(monkey => monkey.scale.set(2.5, 2.5, 2.5)); // Scale down monkeys
    ground.scale.set(0.8, 0.8, 0.8); // Adjust ground size
  } else {
    camera.position.set(0, 8, 16); // Default camera for larger screens
    monkeys.forEach(monkey => monkey.scale.set(4, 4, 4));
    ground.scale.set(1, 1, 1);
  }
}


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  adjustForScreenSize();
});

animate();