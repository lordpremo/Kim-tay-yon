const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const { v4: uuid } = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ====== STATIC FILES (GAME) ======
app.use(express.static(path.join(__dirname, "public")));

// ====== FAKE DB (IN-MEMORY) ======
const users = [];
const sessions = {};

const missionsTemplate = [
  { id: 1, title: "Kimbia 200m", done: false },
  { id: 2, title: "Kimbia 500m", done: false },
  { id: 3, title: "Kusanya 20 coins", done: false },
  { id: 4, title: "Epuka obstacles 30", done: false }
];

function findUserByUsername(username) {
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}
function findUserById(id) {
  return users.find(u => u.id === id);
}

// ====== API ======

// Health check
app.get("/api", (req, res) => {
  res.json({ status: "ok", message: "Temple Run API running" });
});

// REGISTER
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  if (findUserByUsername(username))
    return res.status(400).json({ error: "username already exists" });

  const user = {
    id: uuid(),
    username,
    password, // NOTE: production: hash
    bestScore: 0,
    coins: 0,
    missions: JSON.parse(JSON.stringify(missionsTemplate)),
    createdAt: new Date().toISOString()
  };

  users.push(user);

  res.json({
    id: user.id,
    username: user.username,
    bestScore: user.bestScore,
    coins: user.coins
  });
});

// LOGIN
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = findUserByUsername(username);
  if (!user || user.password !== password)
    return res.status(401).json({ error: "invalid credentials" });

  const token = uuid();
  sessions[token] = user.id;

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      bestScore: user.bestScore,
      coins: user.coins
    }
  });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "").trim();
  if (!token || !sessions[token])
    return res.status(401).json({ error: "unauthorized" });

  req.userId = sessions[token];
  next();
}

// PROFILE
app.get("/api/profile", auth, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  res.json({
    id: user.id,
    username: user.username,
    bestScore: user.bestScore,
    coins: user.coins,
    missions: user.missions
  });
});

// PROGRESS
app.post("/api/progress", auth, (req, res) => {
  const { score, coinsEarned, missionsCompleted } = req.body;
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  if (typeof score === "number" && score > user.bestScore)
    user.bestScore = score;

  if (typeof coinsEarned === "number" && coinsEarned > 0)
    user.coins += coinsEarned;

  if (Array.isArray(missionsCompleted)) {
    missionsCompleted.forEach(id => {
      const m = user.missions.find(mm => mm.id === id);
      if (m) m.done = true;
    });
  }

  res.json({
    bestScore: user.bestScore,
    coins: user.coins,
    missions: user.missions
  });
});

// LEADERBOARD
app.get("/api/leaderboard", (req, res) => {
  const top = [...users]
    .sort((a, b) => b.bestScore - a.bestScore)
    .slice(0, 20)
    .map(u => ({
      id: u.id,
      username: u.username,
      bestScore: u.bestScore
    }));

  res.json(top);
});

// RESET MISSIONS
app.post("/api/reset-missions", auth, (req, res) => {
  const user = findUserById(req.userId);
  if (!user) return res.status(404).json({ error: "user not found" });

  user.missions = JSON.parse(JSON.stringify(missionsTemplate));
  res.json({ missions: user.missions });
});

// SPA fallback (optional)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Temple Run full server on port", PORT));
