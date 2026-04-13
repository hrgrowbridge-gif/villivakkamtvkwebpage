require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const helmet = require('helmet');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_USER = process.env.ADMIN_USER || 'adhav';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'villivakkamtvk@2026!';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'djhsafsdkkkfhkdhkfhdshfhd';
const USE_SECURE_COOKIE = process.env.NODE_ENV === 'production';

const adminToken = crypto.randomBytes(32).toString('hex');

const db = new sqlite3.Database(path.join(__dirname, 'data.db'));

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));

const uploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_')}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 80,
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

function ensureColumn(name, type) {
  db.all('PRAGMA table_info(submissions)', (err, rows) => {
    if (err) {
      console.error('Error checking column', name, err);
      return;
    }
    const exists = rows.some((row) => row.name === name);
    if (!exists) {
      db.run(`ALTER TABLE submissions ADD COLUMN ${name} ${type}`);
    }
  });
}

function buildSchema() {
  db.run(`CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    area TEXT NOT NULL,
    ward TEXT NOT NULL,
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    issueType TEXT NOT NULL,
    issueDescription TEXT NOT NULL,
    age INTEGER,
    additional TEXT,
    fileName TEXT,
    filePath TEXT,
    status TEXT DEFAULT 'Pending',
    createdAt TEXT NOT NULL
  )`, (err) => {
    if (err) {
      console.error('Error creating submissions table', err);
    }
    ensureColumn('fileName', 'TEXT');
    ensureColumn('filePath', 'TEXT');
    ensureColumn('status', "TEXT DEFAULT 'Pending'");
  });
}

function verifyAdmin(req) {
  const token = req.signedCookies.adminToken;
  return token === adminToken;
}

async function verifyPassword(password) {
  if (process.env.ADMIN_PASSWORD_HASH) {
    return bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  }
  return password === ADMIN_PASSWORD;
}

app.post('/api/submit', upload.single('attachment'), (req, res) => {
  const {
    name,
    area,
    ward,
    address,
    phone,
    email,
    issueType,
    issueDescription,
    age,
    additional
  } = req.body;

  if (!name || !area || !ward || !address || !phone || !email || !issueType || !issueDescription) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }

  const fileName = req.file ? req.file.originalname : null;
  const filePath = req.file ? `/uploads/${req.file.filename}` : null;
  const createdAt = new Date().toISOString();

  const stmt = db.prepare(`INSERT INTO submissions (name, area, ward, address, phone, email, issueType, issueDescription, age, additional, fileName, filePath, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  stmt.run(
    name.trim(),
    area.trim(),
    ward.trim(),
    address.trim(),
    phone.trim(),
    email.trim(),
    issueType.trim(),
    issueDescription.trim(),
    age ? parseInt(age, 10) : null,
    additional ? additional.trim() : null,
    fileName,
    filePath,
    createdAt,
    function (err) {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).json({ error: 'Unable to save your submission now. Try again later.' });
      }

      res.json({ success: true, message: 'Your issue has been submitted. Tamilaga Vettri Kazhagam hears you.' });
    }
  );
  stmt.finalize();
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Admin username and password are required.' });
  }

  if (username !== ADMIN_USER) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  const valid = await verifyPassword(password);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }

  res.cookie('adminToken', adminToken, {
    httpOnly: true,
    signed: true,
    sameSite: 'strict',
    secure: USE_SECURE_COOKIE,
    maxAge: 1000 * 60 * 60 * 4
  });
  res.json({ success: true });
});

app.get('/api/admin/entries', (req, res) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  db.all('SELECT * FROM submissions ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ error: 'Unable to read submissions.' });
    }
    res.json({ entries: rows });
  });
});

app.post('/api/admin/status', (req, res) => {
  if (!verifyAdmin(req)) {
    return res.status(401).json({ error: 'Unauthorized access.' });
  }

  const { id, status } = req.body;
  if (!id || !['Pending', 'Completed'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status update.' });
  }

  db.run('UPDATE submissions SET status = ? WHERE id = ?', [status, id], function (err) {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).json({ error: 'Unable to update status.' });
    }
    res.json({ success: true });
  });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('adminToken');
  res.json({ success: true });
});

app.use((req, res) => {
  res.status(404).send('Page not found');
});

buildSchema();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
