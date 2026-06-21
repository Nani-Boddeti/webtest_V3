import { getDb } from '../database';

export function runMigrations(): void {
  const db = getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'founder',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS landing_pages (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      headline TEXT,
      subheadline TEXT,
      call_to_action TEXT DEFAULT 'Sign Up Now',
      brand_color TEXT DEFAULT '#6366f1',
      is_published INTEGER NOT NULL DEFAULT 0,
      winner_id TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (winner_id) REFERENCES signups(id)
    );

    CREATE TABLE IF NOT EXISTS signups (
      id TEXT PRIMARY KEY,
      landing_page_id TEXT NOT NULL,
      email TEXT NOT NULL,
      name TEXT,
      metadata TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id)
    );

    CREATE TABLE IF NOT EXISTS invitations (
      id TEXT PRIMARY KEY,
      landing_page_id TEXT NOT NULL,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      is_used INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id)
    );

    CREATE TABLE IF NOT EXISTS build_plan_tasks (
      id TEXT PRIMARY KEY,
      landing_page_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'To Do',
      priority TEXT NOT NULL DEFAULT 'medium',
      assignee_id TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (landing_page_id) REFERENCES landing_pages(id),
      FOREIGN KEY (assignee_id) REFERENCES users(id)
    );
  `);
}
