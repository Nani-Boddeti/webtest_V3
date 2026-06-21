import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// GET /api/landing-pages - List user's landing pages
router.get('/', (req: Request, res: Response) => {
  const db = getDb();
  const pages = db.prepare(
    'SELECT * FROM landing_pages WHERE user_id = ? ORDER BY created_at DESC'
  ).all(req.user!.userId);

  res.json({ landingPages: pages });
});

// POST /api/landing-pages - Create a landing page
router.post('/', (req: Request, res: Response) => {
  const { title, slug, description, headline, subheadline, callToAction, brandColor } = req.body;

  if (!title || !slug) {
    res.status(400).json({ error: 'Title and slug are required' });
    return;
  }

  const db = getDb();

  // Check slug uniqueness
  const existing = db.prepare('SELECT id FROM landing_pages WHERE slug = ?').get(slug);
  if (existing) {
    res.status(409).json({ error: 'A landing page with this slug already exists' });
    return;
  }

  const id = uuidv4();
  db.prepare(
    `INSERT INTO landing_pages (id, user_id, title, slug, description, headline, subheadline, call_to_action, brand_color)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, req.user!.userId, title, slug, description || null, headline || null, subheadline || null, callToAction || 'Sign Up Now', brandColor || '#6366f1');

  const page = db.prepare('SELECT * FROM landing_pages WHERE id = ?').get(id);
  res.status(201).json({ landingPage: page });
});

// GET /api/landing-pages/:id - Get a specific landing page
router.get('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const page = db.prepare('SELECT * FROM landing_pages WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  res.json({ landingPage: page });
});

// PUT /api/landing-pages/:id - Update a landing page
router.put('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const page = db.prepare('SELECT * FROM landing_pages WHERE id = ? AND user_id = ?').get(req.params.id, req.user!.userId) as any;

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const { title, slug, description, headline, subheadline, callToAction, brandColor, isPublished } = req.body;

  // Check slug uniqueness if changed
  if (slug && slug !== page.slug) {
    const existing = db.prepare('SELECT id FROM landing_pages WHERE slug = ? AND id != ?').get(slug, req.params.id);
    if (existing) {
      res.status(409).json({ error: 'A landing page with this slug already exists' });
      return;
    }
  }

  db.prepare(
    `UPDATE landing_pages SET
      title = COALESCE(?, title),
      slug = COALESCE(?, slug),
      description = COALESCE(?, description),
      headline = COALESCE(?, headline),
      subheadline = COALESCE(?, subheadline),
      call_to_action = COALESCE(?, call_to_action),
      brand_color = COALESCE(?, brand_color),
      is_published = COALESCE(?, is_published),
      updated_at = datetime('now')
    WHERE id = ?`
  ).run(
    title || null, slug || null, description ?? null, headline ?? null,
    subheadline ?? null, callToAction || null, brandColor || null,
    isPublished !== undefined ? (isPublished ? 1 : 0) : null,
    req.params.id
  );

  const updated = db.prepare('SELECT * FROM landing_pages WHERE id = ?').get(req.params.id);
  res.json({ landingPage: updated });
});

// DELETE /api/landing-pages/:id - Delete a landing page
router.delete('/:id', (req: Request, res: Response) => {
  const db = getDb();
  const result = db.prepare('DELETE FROM landing_pages WHERE id = ? AND user_id = ?').run(req.params.id, req.user!.userId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  res.json({ message: 'Landing page deleted successfully' });
});

export default router;
