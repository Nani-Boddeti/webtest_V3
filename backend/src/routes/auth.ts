import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database';
import { config } from '../config';
import { authenticate } from '../middleware/auth';

const router = Router();

function generateToken(userId: string, email: string, role: string): string {
  return jwt.sign({ userId, email, role }, config.jwtSecret, { expiresIn: '7d' });
}

// POST /api/auth/register
router.post('/register', (req: Request, res: Response) => {
  const { email, password, name, token: inviteToken } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required' });
    return;
  }

  const db = getDb();

  // Check if user already exists
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    res.status(409).json({ error: 'User with this email already exists' });
    return;
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const userId = uuidv4();
  let role = 'founder';

  // If invitation token provided, validate and use it
  if (inviteToken) {
    const invitation = db.prepare(
      "SELECT * FROM invitations WHERE token = ? AND is_used = 0 AND expires_at > datetime('now')"
    ).get(inviteToken) as { id: string; landing_page_id: string; email: string; role: string } | undefined;

    if (!invitation) {
      res.status(400).json({ error: 'Invalid or expired invitation token' });
      return;
    }

    if (invitation.email !== email) {
      res.status(400).json({ error: 'Email does not match invitation' });
      return;
    }

    role = invitation.role;

    // Atomic transaction: create user + mark invitation as used
    db.transaction(() => {
      db.prepare(
        'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
      ).run(userId, email, passwordHash, name, role);

      db.prepare('UPDATE invitations SET is_used = 1 WHERE id = ?').run(invitation.id);
    });
  } else {
    db.prepare(
      'INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)'
    ).run(userId, email, passwordHash, name, role);
  }

  const token = generateToken(userId, email, role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    user: { id: userId, email, name, role },
    token,
  });
});

// POST /api/auth/login
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' });
    return;
  }

  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as {
    id: string;
    email: string;
    password_hash: string;
    name: string;
    role: string;
  } | undefined;

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    res.status(401).json({ error: 'Invalid email or password' });
    return;
  }

  const token = generateToken(user.id, user.email, user.role);

  res.cookie('token', token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
    token,
  });
});

// POST /api/auth/logout
router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticate, (req: Request, res: Response) => {
  const db = getDb();
  const user = db.prepare('SELECT id, email, name, role, created_at FROM users WHERE id = ?').get(req.user!.userId);

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({ user });
});

export default router;
