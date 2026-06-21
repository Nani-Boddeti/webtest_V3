import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { getDb } from '../database';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// GET /api/invitations/:landingPageId - List invitations for a landing page
router.get('/:landingPageId', (req: Request, res: Response) => {
  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const invitations = db.prepare(
    'SELECT * FROM invitations WHERE landing_page_id = ? ORDER BY created_at DESC'
  ).all(req.params.landingPageId);

  res.json({ invitations });
});

// POST /api/invitations/:landingPageId - Create invitation
router.post('/:landingPageId', (req: Request, res: Response) => {
  const { email, role } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const id = uuidv4();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

  db.prepare(
    'INSERT INTO invitations (id, landing_page_id, email, token, role, expires_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, req.params.landingPageId, email, token, role || 'member', expiresAt);

  const invitation = db.prepare('SELECT * FROM invitations WHERE id = ?').get(id);
  res.status(201).json({ invitation });
});

// DELETE /api/invitations/:landingPageId/:invitationId - Delete invitation
router.delete('/:landingPageId/:invitationId', (req: Request, res: Response) => {
  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const result = db.prepare('DELETE FROM invitations WHERE id = ? AND landing_page_id = ?').run(
    req.params.invitationId,
    req.params.landingPageId
  );

  if (result.changes === 0) {
    res.status(404).json({ error: 'Invitation not found' });
    return;
  }

  res.json({ message: 'Invitation deleted successfully' });
});

export default router;
