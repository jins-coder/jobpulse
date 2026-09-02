import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userStore } from '../db/userStore.js';
import { authenticateToken, JWT_SECRET } from '../middleware/auth.js';

const router = Router();

// 1. Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, headline } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const newUser = await userStore.createUser({ name, email, password, headline });

    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Registration successful.',
      user: newUser,
      token
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// 2. Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = userStore.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;

    return res.json({
      message: 'Login successful.',
      user: safeUser,
      token
    });
  } catch (err) {
    return res.status(500).json({ error: 'Server error during login.' });
  }
});

// 3. Get Current User Session
router.get('/me', authenticateToken, (req, res) => {
  return res.json({ user: req.user });
});

// 4. Logout
router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully.' });
});

export default router;
