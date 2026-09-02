import jwt from 'jsonwebtoken';
import { userStore } from '../db/userStore.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'jobpulse-super-secret-jwt-key-2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ error: 'Access token required.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }

    const user = userStore.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: 'User associated with token not found.' });
    }

    const { password: _, ...safeUser } = user;
    req.user = safeUser;
    next();
  });
}
