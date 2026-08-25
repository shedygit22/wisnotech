import express from "express";
import cors from "cors";
import multer from "multer";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "cms");
const UPLOADS_DIR = path.join(ROOT, "public", "uploads");
const ADMIN_FILE = path.join(CONTENT_DIR, "admin.json");
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || "wisnotech-cms-secret-2024";

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Ensure directories exist
[CONTENT_DIR, UPLOADS_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Initialize admin user if not exists
function getAdmin() {
  if (fs.existsSync(ADMIN_FILE)) {
    return JSON.parse(fs.readFileSync(ADMIN_FILE, "utf-8"));
  }
  const hash = bcrypt.hashSync("admin123", 10);
  const admin = { username: "admin", password: hash };
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2));
  return admin;
}

// Auth middleware
function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });

// --- Auth routes ---
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const admin = getAdmin();
  if (username === admin.username && bcrypt.compareSync(password, admin.password)) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/api/admin/change-password", auth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = getAdmin();
  if (!bcrypt.compareSync(currentPassword, admin.password)) {
    return res.status(400).json({ error: "Current password is incorrect" });
  }
  admin.password = bcrypt.hashSync(newPassword, 10);
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(admin, null, 2));
  res.json({ success: true });
});

// --- Content CRUD routes ---
// GET /api/admin/pages — list all pages
app.get("/api/admin/pages", auth, (req, res) => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && f !== "admin.json");
  const pages = files.map((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8"));
    return { slug: f.replace(".json", ""), ...data };
  });
  res.json(pages);
});

// GET /api/admin/pages/:slug — get a page
app.get("/api/admin/pages/:slug", auth, (req, res) => {
  const file = path.join(CONTENT_DIR, `${req.params.slug}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: "Page not found" });
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  res.json(data);
});

// PUT /api/admin/pages/:slug — update a page
app.put("/api/admin/pages/:slug", auth, (req, res) => {
  const file = path.join(CONTENT_DIR, `${req.params.slug}.json`);
  const data = req.body;
  data._updatedAt = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ success: true, slug: req.params.slug });
});

// POST /api/admin/pages/:slug — create a page
app.post("/api/admin/pages", auth, (req, res) => {
  const { slug, ...data } = req.body;
  if (!slug) return res.status(400).json({ error: "Slug is required" });
  const file = path.join(CONTENT_DIR, `${slug}.json`);
  if (fs.existsSync(file)) return res.status(409).json({ error: "Page already exists" });
  data._createdAt = new Date().toISOString();
  data._updatedAt = data._createdAt;
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ success: true, slug });
});

// DELETE /api/admin/pages/:slug
app.delete("/api/admin/pages/:slug", auth, (req, res) => {
  const file = path.join(CONTENT_DIR, `${req.params.slug}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: "Page not found" });
  fs.unlinkSync(file);
  res.json({ success: true });
});

// --- Media routes ---
app.get("/api/admin/media", auth, (req, res) => {
  const files = fs.readdirSync(UPLOADS_DIR).filter((f) => !f.startsWith("."));
  const media = files.map((f) => ({
    name: f,
    url: `/uploads/${f}`,
    size: fs.statSync(path.join(UPLOADS_DIR, f)).size,
    modified: fs.statSync(path.join(UPLOADS_DIR, f)).mtime,
  }));
  res.json(media);
});

app.post("/api/admin/media/upload", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({
    name: req.file.filename,
    url: `/uploads/${req.file.filename}`,
    size: req.file.size,
  });
});

app.delete("/api/admin/media/:filename", auth, (req, res) => {
  const file = path.join(UPLOADS_DIR, req.params.filename);
  if (!fs.existsSync(file)) return res.status(404).json({ error: "File not found" });
  fs.unlinkSync(file);
  res.json({ success: true });
});

// Public: serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

// Public: get page content (for the main site to consume)
app.get("/api/content/:slug", (req, res) => {
  const file = path.join(CONTENT_DIR, `${req.params.slug}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: "Page not found" });
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  res.json(data);
});

// Public: get all published content
app.get("/api/content", (req, res) => {
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".json") && f !== "admin.json");
  const content = {};
  files.forEach((f) => {
    const slug = f.replace(".json", "");
    content[slug] = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, f), "utf-8"));
  });
  res.json(content);
});

const PORT = process.env.ADMIN_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Admin server running on http://localhost:${PORT}`);
  console.log(`Admin credentials: admin / admin123 (change on first login)`);
});
