import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDb } from '../database';
import { authenticate } from '../middleware/auth';
import taskTemplate from '../data/taskTemplate.json';

const router = Router();

router.use(authenticate);

// GET /api/build-plan/:landingPageId - Get all tasks for a landing page
router.get('/:landingPageId', (req: Request, res: Response) => {
  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const tasks = db.prepare(
    'SELECT * FROM build_plan_tasks WHERE landing_page_id = ? ORDER BY order_index ASC, created_at ASC'
  ).all(req.params.landingPageId);

  res.json({ tasks });
});

// POST /api/build-plan/:landingPageId/generate - Generate tasks from template
router.post('/:landingPageId/generate', (req: Request, res: Response) => {
  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  // Check if tasks already exist
  const existingCount = db.prepare(
    'SELECT COUNT(*) as count FROM build_plan_tasks WHERE landing_page_id = ?'
  ).get(req.params.landingPageId) as { count: number };

  if (existingCount.count > 0) {
    res.status(409).json({ error: 'Build plan tasks already exist for this landing page' });
    return;
  }

  const tasks = (taskTemplate as Array<{ title: string; description: string; priority: string }>).map((template, index) => {
    const id = uuidv4();
    db.prepare(
      'INSERT INTO build_plan_tasks (id, landing_page_id, title, description, status, priority, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, req.params.landingPageId, template.title, template.description, 'To Do', template.priority || 'medium', index);

    return db.prepare('SELECT * FROM build_plan_tasks WHERE id = ?').get(id);
  });

  res.status(201).json({ tasks });
});

// PUT /api/build-plan/:landingPageId/tasks/:taskId - Update a task
router.put('/:landingPageId/tasks/:taskId', (req: Request, res: Response) => {
  const { title, description, status, priority, assigneeId, orderIndex } = req.body;
  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const existing = db.prepare(
    'SELECT * FROM build_plan_tasks WHERE id = ? AND landing_page_id = ?'
  ).get(req.params.taskId, req.params.landingPageId);

  if (!existing) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  db.prepare(
    `UPDATE build_plan_tasks SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      status = COALESCE(?, status),
      priority = COALESCE(?, priority),
      assignee_id = COALESCE(?, assignee_id),
      order_index = COALESCE(?, order_index),
      updated_at = datetime('now')
    WHERE id = ? AND landing_page_id = ?`
  ).run(
    title || null, description ?? null, status || null,
    priority || null, assigneeId || null,
    orderIndex !== undefined ? orderIndex : null,
    req.params.taskId, req.params.landingPageId
  );

  const updated = db.prepare('SELECT * FROM build_plan_tasks WHERE id = ?').get(req.params.taskId);
  res.json({ task: updated });
});

// DELETE /api/build-plan/:landingPageId/tasks/:taskId - Delete a task
router.delete('/:landingPageId/tasks/:taskId', (req: Request, res: Response) => {
  const db = getDb();

  const page = db.prepare(
    'SELECT id FROM landing_pages WHERE id = ? AND user_id = ?'
  ).get(req.params.landingPageId, req.user!.userId);

  if (!page) {
    res.status(404).json({ error: 'Landing page not found' });
    return;
  }

  const result = db.prepare(
    'DELETE FROM build_plan_tasks WHERE id = ? AND landing_page_id = ?'
  ).run(req.params.taskId, req.params.landingPageId);

  if (result.changes === 0) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  res.json({ message: 'Task deleted successfully' });
});

export default router;
