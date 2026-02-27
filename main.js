// ====== THREE.JS SETUP ======
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog(0x000000, 10, 80);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// LIGHTS
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.7);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 1024;
dirLight.shadow.mapSize.height = 1024;
scene.add(dirLight);

// LANES
const lanes = [-2, 0, 2];

// PLAYER
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.castShadow = true;
player.position.set(0, 1, 0);
scene.add(player);

let currentLaneIndex = 1;
let targetX = lanes[currentLaneIndex];
let verticalVelocity = 0;
let isJumping = false;
let isSliding = false;
let slideTimer = 0;

// GROUND
const groundTiles = [];
const tileLength = 20;
const numTiles = 6;
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });

for (let i = 0; i < numTiles; i++) {
  const groundGeo = new THREE.BoxGeometry(8, 0.5, tileLength);
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.receiveShadow = true;
  ground.position.set(0, -1, -i * tileLength);
  scene.add(ground);
  groundTiles.push(ground);
}

// ENVIRONMENT
const envObjects = [];
const treeMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

function spawnTree(zPos) {
  const trunkGeo = new THREE.CylinderGeometry(0.2, 0.3, 1.5, 6);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.castShadow = true;

  const crownGeo = new THREE.SphereGeometry(0.9, 8, 8);
  const crown = new THREE.Mesh(crownGeo, treeMaterial);
  crown.castShadow = true;

  const group = new THREE.Group();
  trunk.position.y = 0.75;
  crown.position.y = 1.8;
  group.add(trunk);
  group.add(crown);

  const side = Math.random() > 0.5 ? -1 : 1;
  group.position.set(5 * side, -0.5, zPos);
  scene.add(group);
  envObjects.push(group);
}

for (let i = 0; i < 20; i++) {
  spawnTree(-i * 10 - 15);
}

// OBSTACLES
const obstacles = [];
const obstacleMaterial = new THREE.MeshStandardMaterial({ color: 0xff4444 });

function spawnObstacle(zPos) {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const x = lanes[laneIndex];

  const type = Math.random();
  let geo;
  if (type < 0.33) geo = new THREE.BoxGeometry(1.5, 1, 1.5);
  else if (type < 0.66) geo = new THREE.BoxGeometry(1.5, 3, 1.5);
  else geo = new THREE.BoxGeometry(2.5, 2, 1.5);

  const mesh = new THREE.Mesh(geo, obstacleMaterial);
  mesh.castShadow = true;
  mesh.position.set(x, 0, zPos);
  scene.add(mesh);
  obstacles.push(mesh);
}

for (let i = 0; i < 10; i++) {
  spawnObstacle(-30 - i * 15);
}

// COINS
const coins = [];
const coinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });

function spawnCoin(zPos) {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const x = lanes[laneIndex];

  const geo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 16);
  const coin = new THREE.Mesh(geo, coinMaterial);
  coin.castShadow = true;
  coin.rotation.x = Math.PI / 2;
  coin.position.set(x, 1.2, zPos);
  scene.add(coin);
  coins.push(coin);
}

for (let i = 0; i < 20; i++) {
  spawnCoin(-15 - i * 10);
}

// GAME STATE
let speed = 0.3;
let distance = 0;
let isGameOver = false;
let coinsCollected = 0;
let obstaclesPassed = 0;

// MISSIONS
const missions = [
  { id: 1, title: "Kimbia 200m", done: false, check: () => distance >= 200 },
  { id: 2, title: "Kimbia 500m", done: false, check: () => distance >= 500 },
  { id: 3, title: "Kusanya 20 coins", done: false, check: () => coinsCollected >= 20 },
  { id: 4, title: "Epuka obstacles 30", done: false, check: () => obstaclesPassed >= 30 }
];

const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const missionsEl = document.getElementById("missions");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const finalCoinsEl = document.getElementById("finalCoins");

function renderMissions() {
  missionsEl.innerHTML = "";
  missions.forEach(m => {
    const div = document.createElement("div");
    div.textContent = m.title;
    if (m.done) div.classList.add("done");
    missionsEl.appendChild(div);
  });
}
renderMissions();

// INPUT
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

function moveLeft() {
  if (currentLaneIndex > 0) {
    currentLaneIndex--;
    targetX = lanes[currentLaneIndex];
  }
}
function moveRight() {
  if (currentLaneIndex < lanes.length - 1) {
    currentLaneIndex++;
    targetX = lanes[currentLaneIndex];
  }
}
function jump() {
  if (!isJumping && !isSliding) {
    isJumping = true;
    verticalVelocity = 0.5;
  }
}
function slide() {
  if (!isSliding && !isJumping) {
    isSliding = true;
    slideTimer = 0.5;
    player.scale.y = 0.5;
    player.position.y = 0.5;
  }
}

window.addEventListener("keydown", (e) => {
  if (isGameOver) return;
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
  if (e.key === "ArrowRight" || e.key === "d") moveRight();
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") jump();
  if (e.key === "ArrowDown" || e.key === "s") slide();
});

window.addEventListener("touchstart", (e) => {
  if (isGameOver) return;
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

window.addEventListener("touchend", (e) => {
  if (isGameOver) return;
  const t = e.changedTouches[0];
  touchEndX = t.clientX;
  touchEndY = t.clientY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 50) moveRight();
    else if (dx < -50) moveLeft();
  } else {
    if (dy < -50) jump();
    else if (dy > 50) slide();
  }
});

// COLLISIONS
const playerBox = new THREE.Box3();
const obstacleBox = new THREE.Box3();
const coinBox = new THREE.Box3();

function checkCollisions() {
  playerBox.setFromObject(player);

  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obstacleBox.setFromObject(obs);
    if (playerBox.intersectsBox(obstacleBox)) {
      gameOver();
      return;
    }
  }

  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (!coin.visible) continue;
    coinBox.setFromObject(coin);
    if (playerBox.intersectsBox(coinBox)) {
      coin.visible = false;
      coinsCollected++;
      coinsEl.textContent = coinsCollected;
    }
  }
}

// GAME OVER
function gameOver() {
  isGameOver = true;
  finalScoreEl.textContent = Math.floor(distance);
  finalCoinsEl.textContent = coinsCollected;
  gameOverEl.style.display = "flex";
}

// RESIZE
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// MAIN LOOP
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (!isGameOver) {
    distance += speed;
    scoreEl.textContent = Math.floor(distance);
    speed += 0.0005;

    groundTiles.forEach((tile) => {
      tile.position.z += speed;
      if (tile.position.z > camera.position.z + tileLength) {
        tile.position.z -= tileLength * numTiles;
      }
    });

    envObjects.forEach((obj) => {
      obj.position.z += speed;
      if (obj.position.z > camera.position.z + 10) {
        obj.position.z -= 200;
      }
    });

    obstacles.forEach((obs) => {
      const prevZ = obs.position.z;
      obs.position.z += speed;
      if (prevZ < player.position.z && obs.position.z >= player.position.z) {
        obstaclesPassed++;
      }
      if (obs.position.z > camera.position.z + 5) {
        obs.position.z -= 200;
        const laneIndex = Math.floor(Math.random() * lanes.length);
        obs.position.x = lanes[laneIndex];
      }
    });

    coins.forEach((coin) => {
      coin.position.z += speed;
      coin.rotation.z += delta * 5;
      if (coin.position.z > camera.position.z + 5) {
        coin.position.z -= 200;
        coin.visible = true;
        const laneIndex = Math.floor(Math.random() * lanes.length);
        coin.position.x = lanes[laneIndex];
      }
    });

    player.position.x += (targetX - player.position.x) * 0.2;

    if (isJumping) {
      verticalVelocity -= 1.5 * delta;
      player.position.y += verticalVelocity / 0.016;
      if (player.position.y <= 1) {
        player.position.y = 1;
        isJumping = false;
        verticalVelocity = 0;
      }
    }

    if (isSliding) {
      slideTimer -= delta;
      if (slideTimer <= 0) {
        isSliding = false;
        player.scale.y = 1;
        player.position.y = 1;
      }
    }

    camera.position.x += (player.position.x - camera.position.x) * 0.1;
    camera.position.z = player.position.z + 10;
    camera.position.y = 5;
    camera.lookAt(player.position.x, 1, player.position.z);

    let changed = false;
    missions.forEach(m => {
      if (!m.done && m.check()) {
        m.done = true;
        changed = true;
      }
    });
    if (changed) renderMissions();

    checkCollisions();
  }

  renderer.render(scene, camera);
}

animate();
