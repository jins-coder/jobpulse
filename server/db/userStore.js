import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[userStore] Data directory creation warning:', e.message);
}

// In-memory cache synced to disk
let usersCache = [];

// Initialize & seed demo user
function initStore() {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      usersCache = JSON.parse(data);
    }
  } catch {
    usersCache = [];
  }

  // Pre-seed demo user if not present
  const demoEmail = 'alex@jobpulse.io';
  const exists = usersCache.some(u => u.email.toLowerCase() === demoEmail);
  if (!exists) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync('password123', salt);
    const demoUser = {
      id: 'usr-demo-001',
      name: 'Alex Morgan',
      email: demoEmail,
      password: hashedPassword,
      headline: 'Senior Frontend & Vue.js Full-Stack Engineer',
      yearsOfExperience: 6,
      avatar: 'AM',
      createdAt: new Date().toISOString()
    };
    usersCache.push(demoUser);
    saveStore();
  }
}

function saveStore() {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(usersCache, null, 2), 'utf-8');
  } catch (e) {
    console.warn('[userStore] Could not persist users to file (using memory cache):', e.message);
  }
}

initStore();

export const userStore = {
  findByEmail(email) {
    if (!email) return null;
    return usersCache.find(u => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  findById(id) {
    if (!id) return null;
    return usersCache.find(u => u.id === id) || null;
  },

  async createUser({ name, email, password, headline }) {
    const existing = this.findByEmail(email);
    if (existing) {
      throw new Error('User with this email already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      headline: headline || 'Software Engineer',
      yearsOfExperience: 3,
      avatar: name.trim().slice(0, 2).toUpperCase(),
      createdAt: new Date().toISOString()
    };

    usersCache.push(newUser);
    saveStore();

    // Return safe user without password
    const { password: _, ...safeUser } = newUser;
    return safeUser;
  },

  getAll() {
    return usersCache.map(({ password: _, ...safeUser }) => safeUser);
  }
};
