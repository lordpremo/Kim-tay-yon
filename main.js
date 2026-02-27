// ====== DOM ELEMENTS ======
const homeScreenEl = document.getElementById("homeScreen");
const btnStart = document.getElementById("btnStart");
const hudEl = document.getElementById("hud");
const scoreEl = document.getElementById("score");
const coinsEl = document.getElementById("coins");
const missionsEl = document.getElementById("missions");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const finalCoinsEl = document.getElementById("finalCoins");
const bgMusic = document.getElementById("bgMusic");
const sfxCoin = document.getElementById("sfxCoin");
const sfxHit = document.getElementById("sfxHit");
const topRightEl = document.getElementById("topRight");
const btnPause = document.getElementById("btnPause");
const pauseOverlay = document.getElementById("pauseOverlay");
const btnResume = document.getElementById("btnResume");
const magnetStatusEl = document.getElementById("magnetStatus");
const speedStatusEl = document.getElementById("speedStatus");

// ====== GAME STATE ======
let gameStarted = false;
let isGameOver = false;
let isPaused = false;

let baseSpeed = 0.35;
let speed = baseSpeed;
let distance = 0;
let coinsCollected = 0;
let obstaclesPassed = 0;

const START_GIFT_COINS = 50;
const START_GIFT_MAGNET_TIME = 5; // sekunde

// Powerups
let magnetActive = false;
let magnetTimer = 0;
let speedBoostActive = false;
let speedBoostTimer = 0;

// ====== THREE.JS SETUP ======
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x000000, 10, 90);

const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// LIGHTS
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.8);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xfff2cc, 1.1);
dirLight.position.set(10, 20, 10);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x3366ff, 0.3);
fillLight.position.set(-10, 5, 5);
scene.add(fillLight);

// LANES
const lanes = [-2, 0, 2];

// PLAYER
const playerGeometry = new THREE.BoxGeometry(1, 2, 1);
const playerMaterial = new THREE.MeshStandardMaterial({
  color: 0x00ffcc,
  emissive: 0x003333,
  metalness: 0.3,
  roughness: 0.4
});
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

// GROUND + RIVER
const groundTiles = [];
const tileLength = 25;
const numTiles = 7;

const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x3b3b3b });
const riverMaterial = new THREE.MeshStandardMaterial({
  color: 0x003366,
  emissive: 0x001122,
  metalness: 0.8,
  roughness: 0.2
});

for (let i = 0; i < numTiles; i++) {
  const groundGeo = new THREE.BoxGeometry(10, 0.5, tileLength);
  const ground = new THREE.Mesh(groundGeo, groundMaterial);
  ground.receiveShadow = true;
  ground.position.set(0, -1, -i * tileLength);
  scene.add(ground);
  groundTiles.push(ground);

  const riverGeo = new THREE.BoxGeometry(3, 0.2, tileLength);
  const river = new THREE.Mesh(riverGeo, riverMaterial);
  river.position.set(-4, -1.1, -i * tileLength);
  scene.add(river);
}

// ENVIRONMENT
const envObjects = [];

function spawnTree(zPos, side) {
  const trunkGeo = new THREE.CylinderGeometry(0.25, 0.35, 1.8, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.castShadow = true;

  const crownGeo = new THREE.SphereGeometry(1.1, 10, 10);
  const crownMat = new THREE.MeshStandardMaterial({ color: 0x1f8b4c });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.castShadow = true;

  const group = new THREE.Group();
  trunk.position.y = 0.9;
  crown.position.y = 2.2;
  group.add(trunk);
  group.add(crown);

  group.position.set(side * (5 + Math.random() * 2), -0.5, zPos);
  scene.add(group);
  envObjects.push(group);
}

function spawnRock(zPos, side) {
  const rockGeo = new THREE.DodecahedronGeometry(0.7 + Math.random() * 0.5);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const rock = new THREE.Mesh(rockGeo, rockMat);
  rock.castShadow = true;
  rock.position.set(side * (4 + Math.random() * 2), -0.5, zPos);
  scene.add(rock);
  envObjects.push(rock);
}

for (let i = 0; i < 30; i++) {
  const z = -i * 10 - 15;
  const side = Math.random() > 0.5 ? 1 : -1;
  spawnTree(z, side);
  if (Math.random() > 0.5) spawnRock(z + 3, side);
}

// OBSTACLES
const obstacles = [];
const obstacleMaterial = new THREE.MeshStandardMaterial({
  color: 0xff4444,
  emissive: 0x330000
});

function spawnObstacle(zPos) {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const x = lanes[laneIndex];

  const type = Math.random();
  let geo;
  if (type < 0.33) {
    geo = new THREE.BoxGeometry(1.5, 1, 1.5);
  } else if (type < 0.66) {
    geo = new THREE.BoxGeometry(1.5, 3, 1.5);
  } else {
    geo = new THREE.BoxGeometry(2.5, 2, 1.5);
  }

  const mesh = new THREE.Mesh(geo, obstacleMaterial);
  mesh.castShadow = true;
  mesh.position.set(x, 0, zPos);
  scene.add(mesh);
  obstacles.push(mesh);
}

for (let i = 0; i < 12; i++) {
  spawnObstacle(-35 - i * 18);
}

// COINS
const coins = [];
const coinMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,
  emissive: 0x664400,
  metalness: 1,
  roughness: 0.2
});

function spawnCoin(zPos) {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const x = lanes[laneIndex];

  const geo = new THREE.CylinderGeometry(0.45, 0.45, 0.12, 20);
  const coin = new THREE.Mesh(geo, coinMaterial);
  coin.castShadow = true;
  coin.rotation.x = Math.PI / 2;
  coin.position.set(x, 1.3, zPos);
  scene.add(coin);
  coins.push(coin);
}

for (let i = 0; i < 25; i++) {
  spawnCoin(-18 - i * 10);
}

// POWERUP OBJECTS (magnet + speed)
const powerups = [];
const powerupMaterialMagnet = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  emissive: 0x004444
});
const powerupMaterialSpeed = new THREE.MeshStandardMaterial({
  color: 0xff8800,
  emissive: 0x442200
});

function spawnPowerup(zPos, type) {
  const laneIndex = Math.floor(Math.random() * lanes.length);
  const x = lanes[laneIndex];

  const geo = new THREE.TorusGeometry(0.6, 0.15, 12, 24);
  const mat = type === "magnet" ? powerupMaterialMagnet : powerupMaterialSpeed;
  const pu = new THREE.Mesh(geo, mat);
  pu.castShadow = true;
  pu.position.set(x, 1.5, zPos);
  pu.userData.type = type;
  scene.add(pu);
  powerups.push(pu);
}

// weka powerups wachache
for (let i = 0; i < 6; i++) {
  spawnPowerup(-40 - i * 40, i % 2 === 0 ? "magnet" : "speed");
}

// MISSIONS
const missions = [
  { id: 1, title: "Kimbia 200m", done: false, check: () => distance >= 200 },
  { id: 2, title: "Kimbia 600m", done: false, check: () => distance >= 600 },
  { id: 3, title: "Kusanya 30 coins", done: false, check: () => coinsCollected >= 30 },
  { id: 4, title: "Epuka obstacles 40", done: false, check: () => obstaclesPassed >= 40 },
  { id: 5, title: "Tumia powerup 1+", done: false, check: () => magnetUsed || speedBoostUsed }
];

let magnetUsed = false;
let speedBoostUsed = false;

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
  if (!gameStarted || isGameOver || isPaused) return;
  if (currentLaneIndex > 0) {
    currentLaneIndex--;
    targetX = lanes[currentLaneIndex];
  }
}
function moveRight() {
  if (!gameStarted || isGameOver || isPaused) return;
  if (currentLaneIndex < lanes.length - 1) {
    currentLaneIndex++;
    targetX = lanes[currentLaneIndex];
  }
}
function jump() {
  if (!gameStarted || isGameOver || isPaused) return;
  if (!isJumping && !isSliding) {
    isJumping = true;
    verticalVelocity = 0.6;
  }
}
function slide() {
  if (!gameStarted || isGameOver || isPaused) return;
  if (!isSliding && !isJumping) {
    isSliding = true;
    slideTimer = 0.6;
    player.scale.y = 0.5;
    player.position.y = 0.5;
  }
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !gameStarted && !isGameOver) {
    startGame();
    return;
  }
  if (e.key === "Escape") {
    togglePause();
    return;
  }
  if (e.key === "ArrowLeft" || e.key === "a") moveLeft();
  if (e.key === "ArrowRight" || e.key === "d") moveRight();
  if (e.key === "ArrowUp" || e.key === "w" || e.key === " ") jump();
  if (e.key === "ArrowDown" || e.key === "s") slide();
});

window.addEventListener("touchstart", (e) => {
  if (!gameStarted && !isGameOver) {
    startGame();
    return;
  }
  const t = e.touches[0];
  touchStartX = t.clientX;
  touchStartY = t.clientY;
});

window.addEventListener("touchend", (e) => {
  if (!gameStarted || isGameOver || isPaused) return;
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
const powerupBox = new THREE.Box3();

function checkCollisions() {
  playerBox.setFromObject(player);

  // Obstacles
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obstacleBox.setFromObject(obs);
    if (playerBox.intersectsBox(obstacleBox)) {
      sfxHit.currentTime = 0;
      sfxHit.play().catch(() => {});
      gameOver();
      return;
    }
  }

  // Coins
  for (let i = 0; i < coins.length; i++) {
    const coin = coins[i];
    if (!coin.visible) continue;

    if (magnetActive) {
      const dx = player.position.x - coin.position.x;
      const dz = player.position.z - coin.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist < 5) {
        coin.position.x += dx * 0.15;
        coin.position.z += dz * 0.15;
      }
    }

    coinBox.setFromObject(coin);
    if (playerBox.intersectsBox(coinBox)) {
      coin.visible = false;
      coinsCollected++;
      coinsEl.textContent = coinsCollected;
      sfxCoin.currentTime = 0;
      sfxCoin.play().catch(() => {});
    }
  }

  // Powerups
  for (let i = 0; i < powerups.length; i++) {
    const pu = powerups[i];
    if (!pu.visible) continue;
    powerupBox.setFromObject(pu);
    if (playerBox.intersectsBox(powerupBox)) {
      pu.visible = false;
      if (pu.userData.type === "magnet") {
        magnetActive = true;
        magnetTimer = 8;
        magnetUsed = true;
        magnetStatusEl.textContent = "On";
      } else {
        speedBoostActive = true;
        speedBoostTimer = 6;
        speed = baseSpeed * 1.7;
        speedBoostUsed = true;
        speedStatusEl.textContent = "Boost";
      }
    }
  }
}

// GAME OVER
function gameOver() {
  if (isGameOver) return;
  isGameOver = true;
  finalScoreEl.textContent = Math.floor(distance);
  finalCoinsEl.textContent = coinsCollected;
  gameOverEl.style.display = "flex";
  bgMusic.pause();
}

// START GAME
function startGame() {
  if (gameStarted) return;
  gameStarted = true;
  hudEl.style.display = "block";
  homeScreenEl.style.display = "none";
  topRightEl.style.display = "flex";

  coinsCollected += START_GIFT_COINS;
  coinsEl.textContent = coinsCollected;

  magnetActive = true;
  magnetTimer = START_GIFT_MAGNET_TIME;
  magnetStatusEl.textContent = "On";

  bgMusic.volume = 0.4;
  bgMusic.play().catch(() => {});
}

// PAUSE
function togglePause() {
  if (!gameStarted || isGameOver) return;
  isPaused = !isPaused;
  if (isPaused) {
    pauseOverlay.style.display = "flex";
    bgMusic.pause();
  } else {
    pauseOverlay.style.display = "none";
    bgMusic.play().catch(() => {});
  }
}

btnPause.addEventListener("click", togglePause);
btnResume.addEventListener("click", togglePause);
btnStart.addEventListener("click", () => {
  startGame();
  bgMusic.play().catch(() => {});
});

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

  if (gameStarted && !isGameOver && !isPaused) {
    distance += speed;
    scoreEl.textContent = Math.floor(distance);

    baseSpeed += 0.00015;
    if (!speedBoostActive) speed = baseSpeed;

    // Powerup timers
    if (magnetActive) {
      magnetTimer -= delta;
      if (magnetTimer <= 0) {
        magnetActive = false;
        magnetStatusEl.textContent = "Off";
      }
    }
    if (speedBoostActive) {
      speedBoostTimer -= delta;
      if (speedBoostTimer <= 0) {
        speedBoostActive = false;
        speed = baseSpeed;
        speedStatusEl.textContent = "Normal";
      }
    }

    // Ground & river
    groundTiles.forEach((tile) => {
      tile.position.z += speed;
      if (tile.position.z > camera.position.z + tileLength) {
        tile.position.z -= tileLength * numTiles;
      }
    });

    // Env
    envObjects.forEach((obj) => {
      obj.position.z += speed;
      if (obj.position.z > camera.position.z + 12) {
        obj.position.z -= 260;
      }
    });

    // Obstacles
    obstacles.forEach((obs) => {
      const prevZ = obs.position.z;
      obs.position.z += speed;
      if (prevZ < player.position.z && obs.position.z >= player.position.z) {
        obstaclesPassed++;
      }
      if (obs.position.z > camera.position.z + 6) {
        obs.position.z -= 260;
        const laneIndex = Math.floor(Math.random() * lanes.length);
        obs.position.x = lanes[laneIndex];
      }
    });

    // Coins
    coins.forEach((coin) => {
      coin.position.z += speed;
      coin.rotation.z += delta * 5;
      if (coin.position.z > camera.position.z + 6) {
        coin.position.z -= 260;
        coin.visible = true;
        const laneIndex = Math.floor(Math.random() * lanes.length);
        coin.position.x = lanes[laneIndex];
      }
    });

    // Powerups
    powerups.forEach((pu) => {
      pu.position.z += speed;
      pu.rotation.y += delta * 3;
      if (pu.position.z > camera.position.z + 6) {
        pu.position.z -= 260;
        pu.visible = true;
        const laneIndex = Math.floor(Math.random() * lanes.length);
        pu.position.x = lanes[laneIndex];
      }
    });

    // Lane movement
    player.position.x += (targetX - player.position.x) * 0.2;

    // Jump
    if (isJumping) {
      verticalVelocity -= 2.2 * delta;
      player.position.y += verticalVelocity / 0.016;
      if (player.position.y <= 1) {
        player.position.y = 1;
        isJumping = false;
        verticalVelocity = 0;
      }
    }

    // Slide
    if (isSliding) {
      slideTimer -= delta;
      if (slideTimer <= 0) {
        isSliding = false;
        player.scale.y = 1;
        player.position.y = 1;
      }
    }

    // Camera follow
    camera.position.x += (player.position.x - camera.position.x) * 0.1;
    camera.position.z = player.position.z + 12;
    camera.position.y = 5.5;
    camera.lookAt(player.position.x, 1.2, player.position.z);

    // Missions
    let changed = false;
    missions.forEach(m => {
      if (!m.done && m.check()) {
        m.done = true;
        changed = true;
      }
    });
    if (changed) renderMissions();

    // Collisions
    checkCollisions();
  }

  renderer.render(scene, camera);
}

animate();
