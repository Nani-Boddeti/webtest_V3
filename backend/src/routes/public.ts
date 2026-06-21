import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database';

const router = Router();

// GET /api/public/landing-page/:slug - Public landing page (no auth required)
router.get('/landing-page/:slug', (req: Request, res: Response) => {
  const db = getDb();
  const page = db.prepare(
    'SELECT * FROM landing_pages WHERE slug = ? AND is_published = 1'
  ).get(req.params.slug) as any;

  if (!page) {
    res.status(404).json({ error: 'Landing page not found or not published' });
    return;
  }

  // Get signup count
  const signupCount = db.prepare(
    'SELECT COUNT(*) as count FROM signups WHERE landing_page_id = ?'
  ).get(page.id) as { count: number };

  res.json({
    landingPage: {
      id: page.id,
      title: page.title,
      slug: page.slug,
      description: page.description,
      headline: page.headline,
      subheadline: page.subheadline,
      callToAction: page.call_to_action,
      brandColor: page.brand_color,
      signupCount: signupCount.count,
    },
  });
});

// POST /api/public/signup - Public signup (no auth required)
router.post('/signup', (req: Request, res: Response) => {
  const { landingPageId, email, name, metadata } = req.body;

  if (!landingPageId || !email) {
    res.status(400).json({ error: 'Landing page ID and email are required' });
    return;
  }

  const db = getDb();

  // Verify landing page exists and is published
  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND is_published = 1'
  ).get(landingPageId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found or not published' });
    return;
  }

  // Check for duplicate signup
  const existing = db.prepare(
    'SELECT id FROM signups WHERE landing_page_id = ? AND email = ?'
  ).get(landingPageId, email);

  if (existing) {
    res.status(409).json({ error: 'This email has already signed up' });
    return;
  }

  const id = uuidv4();
  db.prepare(
    'INSERT INTO signups (id, landing_page_id, email, name, metadata) VALUES (?, ?, ?, ?, ?)'
  ).run(id, landingPageId, email, name || null, metadata ? JSON.stringify(metadata) : null);

  res.status(201).json({
    signup: { id, email, name: name || null },
    message: 'Successfully signed up!',
  });
});

export default router;
