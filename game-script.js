// import * as THREE from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const renderer = new THREE.WebGLRenderer({ antialias: true });
// renderer.setClearColor(0x000000, 0);
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// const popSound = document.getElementById('popSound'); // Audio element for pop sound
// const scoreDisplay = document.getElementById('score');
// const messageDisplay = document.getElementById('message');
// const box = document.getElementById('box'); // Reference to the box element

// // Add ambient and directional lights for better visuals
// const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft white light
// scene.add(ambientLight);

// const spotLight = new THREE.SpotLight(0xffffff, 1);
// spotLight.position.set(0, 25, 0);
// spotLight.castShadow = true;
// spotLight.shadow.bias = -0.0001;
// scene.add(spotLight);

// // Create a box-like ground
// const groundGeometry = new THREE.BoxGeometry(10, 3, 10); // Making it 3 units high
// const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x32CD32 });
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// ground.position.y = -1.5; // Lowering the ground to hide monkeys
// scene.add(ground);

// // Create hole positions
// const holePositions = [
//   [-3, 0, -3], [0, 0, -3], [3, 0, -3],
//   [-3, 0, 0], [0, 0, 0], [3, 0, 0],
//   [-3, 0, 3], [0, 0, 3], [3, 0, 3]
// ];
// const holeGeometry = new THREE.CircleGeometry(0.7, 32);
// const holeMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });
// for (const position of holePositions) {
//   const hole = new THREE.Mesh(holeGeometry, holeMaterial);
//   hole.position.set(...position);
//   hole.rotation.x = -Math.PI / 2;
//   hole.position.y = 0.05; // Slightly above the ground for visibility
//   scene.add(hole);
// }

// const loader = new GLTFLoader();
// let monkeys = [];
// let score = 0;
// const monkeyDuration = 1000; // Duration for which monkey stays visible (in ms)
// let currentMonkey = null; // Current visible monkey


// function loadMonkeyModel(position) {
//   loader.load('/public/mole_day_diglett/scene.gltf', function (gltf) {
//     const monkey = gltf.scene;
//     monkey.scale.set(4, 4, 4); // Smaller monkey size
//     monkey.position.set(position[0], -100, position[2]); // Initially below ground level
//     scene.add(monkey);
//     monkeys.push(monkey);
//   }, undefined, function (error) {
//     console.error(error);
//   });
// }

// holePositions.forEach(position => loadMonkeyModel(position));

// // Set camera position
// camera.position.z = 8;
// camera.position.y = 6;

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableRotate = false;
// controls.update();

// const raycaster = new THREE.Raycaster();
// const mouse = new THREE.Vector2();

// // Update score display
// function updateScore() {
//   scoreDisplay.textContent = `Score: ${score}`;
// }

// // Function to show monkey over a random hole
// function showMonkey() {
//   // If there's already a monkey displayed, hide it first
//   if (currentMonkey) {
//     currentMonkey.position.y = -50; // Move it below the ground to hide
//   }

//   // Pick a random hole position
//   const randomIndex = Math.floor(Math.random() * holePositions.length);
//   const position = holePositions[randomIndex];

//   // Show the monkey above the hole
//   currentMonkey = monkeys[randomIndex];
//   currentMonkey.position.set(position[0], 0.4, position[2]); // Raise above the ground

//   // Set a timeout to hide the monkey after the duration
//   setTimeout(() => {
//     if (currentMonkey === monkeys[randomIndex]) {
//       currentMonkey.position.y = -50; // Hide monkey after duration
//       currentMonkey = null; // Clear current monkey
//     }
//   }, monkeyDuration);
// }

// // Start showing monkeys at intervals
// setInterval(showMonkey, 1200); // Show a new monkey every 2 seconds

// window.addEventListener('click', (event) => {
//   // Calculate mouse position in normalized device coordinates
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

//   // Update the picking ray with the camera and mouse position
//   raycaster.setFromCamera(mouse, camera);

//   // Calculate objects intersecting the picking ray
//   const intersects = raycaster.intersectObjects(monkeys, true); // true checks all child objects

//   if (intersects.length > 0) {
//     // Play the pop sound
//     popSound.currentTime = 0; // Rewind the sound
//     popSound.play();

//     // Increase the score
//     score++;
//     updateScore();

//     // Check if the score is 3
//     if (score === 3) {
//       setTimeout(() => {
//         window.location.href = 'home-page.html'; // Change to your portfolio page
//       });
//     }

//     // Hide the entire clicked monkey (move the whole parent monkey object below ground)
//     const clickedMesh = intersects[0].object;  // The part of the monkey that was clicked
//     const monkey = monkeys.find(m => m.contains(clickedMesh)); // Find the entire monkey that contains the clicked part

//     if (monkey) {
//       monkey.position.y = -10; // Move the whole monkey below ground
//     }

//     // Ensure currentMonkey is set to null only if the clicked monkey was the visible one
//     if (monkey === currentMonkey) {
//       currentMonkey = null; // Clear current monkey
//     }
//   }
// });


// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
//   controls.update();
// }

// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// });

// animate();


import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const popSound = document.getElementById('popSound'); // Audio element for pop sound
const scoreDisplay = document.getElementById('score');
const messageDisplay = document.getElementById('message');
const box = document.getElementById('box'); // Reference to the box element

// Add ambient and directional lights for better visuals
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Soft white light
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 1);
spotLight.position.set(0, 25, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

// Create a box-like ground
const groundGeometry = new THREE.BoxGeometry(10, 3, 10); // Making it 3 units high
const groundMaterial = new THREE.MeshPhongMaterial({ color: 0x32CD32 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.position.y = -1.5; // Lowering the ground to hide monkeys
scene.add(ground);

// Create hole positions
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
  hole.position.y = 0.05; // Slightly above the ground for visibility
  scene.add(hole);
}

const loader = new GLTFLoader();
let monkeys = [];
let score = 0;
const monkeyDuration = 1000; // Duration for which monkey stays visible (in ms)
let currentMonkey = null; // Current visible monkey

// Create a parent object for the monkeys
const monkeyParent = new THREE.Object3D();
scene.add(monkeyParent);

function loadMonkeyModel(position) {
  loader.load('/public/diglett.glb', function (gltf) {
    const monkey = gltf.scene;
    monkey.scale.set(4, 4, 4); // Smaller monkey size
    monkey.position.set(position[0], -100, position[2]); // Initially below ground level
    monkeyParent.add(monkey); // Add the loaded monkey to the parent object
    monkeys.push(monkey);
  }, undefined, function (error) {
    console.error(error);
  });
}

holePositions.forEach(position => loadMonkeyModel(position));

// Set camera position
camera.position.z = 8;
camera.position.y = 6;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.update();

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Update score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Function to show monkey over a random hole
function showMonkey() {
  // If there's already a monkey displayed, hide it first
  if (currentMonkey) {
    currentMonkey.position.y = -50; // Move it below the ground to hide
  }

  // Pick a random hole position
  const randomIndex = Math.floor(Math.random() * holePositions.length);
  const position = holePositions[randomIndex];

  // Show the monkey above the hole
  currentMonkey = monkeys[randomIndex];
  currentMonkey.position.set(position[0], 0.4, position[2]); // Raise above the ground

  // Set a timeout to hide the monkey after the duration
  setTimeout(() => {
    if (currentMonkey === monkeys[randomIndex]) {
      currentMonkey.position.y = -50; // Hide monkey after duration
      currentMonkey = null; // Clear current monkey
    }
  }, monkeyDuration);
}

// Start showing monkeys at intervals
setInterval(showMonkey, 1200); // Show a new monkey every 2 seconds

window.addEventListener('click', (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(monkeys, true); // true checks all child objects

  if (intersects.length > 0) {
    // Play the pop sound
    popSound.currentTime = 0; // Rewind the sound
    popSound.play();

    // Increase the score
    score++;
    updateScore();

    // Check if the score is 3
    if (score === 3) {
      setTimeout(() => {
        window.location.href = 'home-page.html'; // Change to your portfolio page
      });
    }

    // Hide the entire clicked monkey (move the whole parent monkey object below ground)
    const clickedMesh = intersects[0].object;  // The part of the monkey that was clicked
    const monkey = monkeys.find(m => m.contains(clickedMesh)); // Find the entire monkey that contains the clicked part

    if (monkey) {
      monkey.position.y = -10; // Move the whole monkey below ground
    }

    // Ensure currentMonkey is set to null only if the clicked monkey was the visible one
    if (monkey === currentMonkey) {
      currentMonkey = null; // Clear current monkey
    }
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
