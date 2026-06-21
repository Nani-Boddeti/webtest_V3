import { Router, Request, Response } from 'express';
import { getDb } from '../database';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// GET /api/signups/:landingPageId - Get signups for a landing page
router.get('/:landingPageId', (req: Request, res: Response) => {
  const db = getDb();

  // Verify ownership
  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const signups = db.prepare(
    'SELECT * FROM signups WHERE landing_page_id = ? ORDER BY created_at DESC'
  ).all(req.params.landingPageId);

  res.json({ signups });
});

// POST /api/signups/:landingPageId/winner - Set a winner
router.post('/:landingPageId/winner', (req: Request, res: Response) => {
  const { signupId } = req.body;

  if (!signupId) {
    res.status(400).json({ error: 'Signup ID is required' });
    return;
  }

  const db = getDb();

  // Verify ownership
  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId) as any;

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  // Atomic transaction: clear existing winner first, then set new one
  db.transaction(() => {
    db.prepare('UPDATE landing_pages SET winner_id = NULL WHERE id = ?').run(req.params.landingPageId);
    db.prepare('UPDATE landing_pages SET winner_id = ? WHERE id = ?').run(signupId, req.params.landingPageId);
  });

  const updatedPage = db.prepare('SELECT * FROM landing_pages WHERE id = ?').get(req.params.landingPageId);
  res.json({ landingPage: updatedPage });
});

// DELETE /api/signups/:landingPageId/winner - Clear winner
router.delete('/:landingPageId/winner', (req: Request, res: Response) => {
  const db = getDb();

  const result = db.prepare(
    'UPDATE landing_pages SET winner_id = NULL WHERE id = ? AND user_id = ?'
  ).run(req.params.landingPageId, req.user!.userId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const updatedPage = db.prepare('SELECT * FROM landing_pages WHERE id = ?').get(req.params.landingPageId);
  res.json({ landingPage: updatedPage });
});

export default router;
