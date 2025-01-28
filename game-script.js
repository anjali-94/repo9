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
    const sidebar = document.getElementById('sidebar');
    const buttons = document.querySelectorAll('.button');
    const icons = document.querySelectorAll('.in-box .icon');

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
    const monkeyDuration = 950;
    let currentMonkey = null;

    function loadMonkeyModel(position) {
      loader.load('/public/diglett.glb', function (gltf) {
        const monkey = gltf.scene;
        monkey.scale.set(4, 4, 4);
        monkey.position.set(position[0], -1000, position[2]);
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

      if (score >= 8 && score <= 11) {
        const icon = icons[score - 8];
        icon.style.display = 'inline-block';
        icon.style.opacity = '1';
        icon.style.transition = 'opacity 0.5s ease';

        if (score === 11) {
          scoreDisplay.style.color = '#FF4500';
          setTimeout(() => {
            // Remove the score display
            scoreDisplay.style.display = 'none';

            buttons.forEach(button => {
              button.disabled = false; 
              button.style.opacity = "1"; 
            });

            // Remove the ground and holes
            scene.remove(ground);
            scene.children = scene.children.filter(child => child !== ground);

            // Remove all the monkeys
            monkeys.forEach(monkey => {
              scene.remove(monkey);
            });
            monkeys = []; 

            // Remove holes from the scene
            const holeMeshes = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry instanceof THREE.CircleGeometry);
            holeMeshes.forEach(hole => {
              scene.remove(hole);
            });

            const notification = document.querySelector('.notification');
            notification.classList.add('visible');

            const closeBtn = document.querySelector('.close-btn');
            closeBtn.addEventListener('click', () => {
              notification.classList.remove('visible');
            });

          }, 300);

        }

      }
      else {
        scoreDisplay.style.color = 'white';
      }
    }


    function showMonkey() {
      if (currentMonkey) {
        currentMonkey.position.y = -1000; // Move it below the ground to hide
      }

      const randomIndex = Math.floor(Math.random() * holePositions.length);
      const position = holePositions[randomIndex];

      currentMonkey = monkeys[randomIndex];
      currentMonkey.position.set(position[0], 0.4, position[2]); // Raise above the ground

      setTimeout(() => {
        if (currentMonkey === monkeys[randomIndex]) {
          currentMonkey.position.y = -1000; // Hide monkey after duration
          currentMonkey = null;
        }
      }, monkeyDuration);
    }

    setInterval(showMonkey, 1200);

    // Particle Effect Setup
    const particleCanvas = document.getElementById('particleCanvas');
    const particleContext = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    let particles = [];

    function createParticles(x, y) {
      for (let i = 0; i < 20; i++) {
        particles.push({
          x: x,
          y: y,
          radius: Math.random() * 3 + 2,
          color: `hsl(${Math.random() * 360}, 100%, 50%)`,
          speedX: (Math.random() - 0.5) * 4,
          speedY: (Math.random() - 0.5) * 4,
          alpha: 1
        });
      }
    }

    function updateParticles() {
      particles.forEach((particle, index) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.alpha -= 0.02;
        if (particle.alpha <= 0) particles.splice(index, 1);
      });
    }

    function drawParticles() {
      particleContext.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
      particles.forEach(particle => {
        particleContext.fillStyle = particle.color;
        particleContext.globalAlpha = particle.alpha;
        particleContext.beginPath();
        particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleContext.fill();
      });
    }

    // Animate particles
    function animateParticles() {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();

    const buttonContent = {
      homeButton: {
        title: "Welcome to My Portfolio",
        text: "Hello and welcome to my portfolio! Step into the world of creativity and innovation. Here, you’ll find a glimpse into my journey, projects, and expertise  My portfolio showcases a blend of technical skills and artistic vision."
      },
      aboutButton: {
        title: "About Me",
        text: "Hi there! I’m Anjali, a passionate web developer with a knack for modern web technologies. My journey is marked by a commitment to crafting immersive web experiences that blend creativity with functionality. Along the way, I've achieved notable milestones, including solving problems on LeetCode and being selected for prestigious internships, such as the Vice Chancellor's Internship at the University of Delhi. My certifications in Python, Artificial Intelligence, and microcontroller programming further underscore my dedication to continuous learning and growth."
      },
      skillsButton: {
        title: "My Skills",
        text: "Highly skilled in programming languages including C, C++, Python, PHP, JavaScript, TypeScript, and frameworks like React.js. Proficient in modern web technologies and tools such as Three.js, Node.js, Django, REST APIs, Machine Learning, Tailwind CSS, Bootstrap, WordPress, and Figma. Experienced in managing relational and non-relational databases, including MySQL, MongoDB, PostgreSQL, and deploying solutions on cloud platforms like AWS, Azure, and Google Cloud Platform (GCP). Demonstrated expertise in version control systems such as Git, GitHub, GitLab, and adept at data structures and algorithms, solving complex technical challenges with efficiency. Proven ability to collaborate in team environments, lead projects, and communicate effectively. Skilled in delivering optimized, scalable, and user-centric solutions tailored to diverse client needs."
      },
      educationButton: {
        title: "Education",
        text: "I hold a Master’s degree in Informatics and a Bachelor’s degree in Electronic Science, which provide me with a solid foundation in both theoretical concepts and practical applications. My academic journey has equipped me with advanced knowledge in data science, information systems, and computing technologies, enabling me to analyze complex problems and devise innovative solutions. This educational background, combined with hands-on experience through various projects and internships, empowers me to approach web development with analytical precision and creativity."
      },
      experienceButton: {
        title: "Experience",
        text: "Throughout my journey, I’ve engaged in diverse web development projects that challenge me to think outside the box. My professional experience includes internships at the University of Delhi, where I contributed to data processing and analysis, and at Thotnr Pvt. Ltd., where I developed responsive web pages. Whether working on small-scale applications or contributing to large-scale initiatives, I relish the opportunity to learn and grow. My experiences solidify my skills in web development, algorithms, and programming."
      },
      contactButton: {
        title: "Get in Touch",
        text: "Interested in collaborating? Reach me via email at anjalishr987@gmail.com or connect with me on LinkedIn. I’m always up for discussing web development, algorithms, or any exciting new challenges. Let’s build something great together!"
      }
    };

    // Selecting buttons for overlay interaction
    const overlayButtons = document.querySelectorAll('.button'); 
    overlayButtons.forEach(button => {
      button.addEventListener('click', () => {
        const buttonId = button.id;
        const overlay = document.getElementById('fullScreenOverlay');
        const title = document.getElementById('overlayTitle');
        const text = document.getElementById('overlayText');

        // Update content based on button
        title.textContent = buttonContent[buttonId].title;
        text.textContent = buttonContent[buttonId].text;

        // Show the overlay
        overlay.classList.add('visible');
      });
    });

    // Close overlay when clicking the close button
    document.getElementById('closeOverlay').addEventListener('click', () => {
      const overlay = document.getElementById('fullScreenOverlay');
      overlay.classList.remove('visible');
    });


    window.addEventListener('click', (event) => {

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(monkeys, true);

      if (intersects.length > 0) {
        // Trigger particle effect at the clicked mole's position
        const rect = renderer.domElement.getBoundingClientRect();
        createParticles(event.clientX - rect.left, event.clientY - rect.top);

        popSound.currentTime = 0;
        popSound.play();
        score++;
        updateScore();

        // Show the sidebar on first tap
        if (!sidebar.classList.contains('visible')) {
          sidebar.classList.add('visible');
        } else {
          // Show buttons one by one after sidebar is visible
          const buttonToShow = buttons[Math.min(score - 2, buttons.length - 1)];
          if (buttonToShow && buttonToShow.classList.contains('hidden')) {
            buttonToShow.classList.remove('hidden');
            buttonToShow.classList.add('visible', 'pop-animation');

            // Reset the button animation after it finishes
            setTimeout(() => {
              buttonToShow.classList.remove('pop-animation');
            }, 300);
          }
        }

        const clickedMesh = intersects[0].object;
        const monkey = monkeys.find(m => m.contains(clickedMesh));

        if (monkey) {
          monkey.position.y = -50; // Move the whole monkey below ground
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

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    window.addEventListener('resize', () => {
      particleCanvas.width = window.innerWidth;
      particleCanvas.height = window.innerHeight;
    });


    animate();