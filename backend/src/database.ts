import initSqlJs, { Database as SqlJsDb, SqlJsStatic } from 'sql.js';
import fs from 'fs';
import path from 'path';
import { config } from './config';

let SQL: SqlJsStatic;
let db: SqlJsDb;

/**
 * A thin wrapper around sql.js that provides a better-sqlite3-like API.
 */
class Statement {
  private stmt: any;
  private sql: string;

  constructor(sql: string) {
    this.sql = sql;
    this.stmt = db.prepare(sql);
  }

  bind(...params: any[]): this {
    if (params.length > 0) {
      // sql.js uses 1-based indexing for bind parameters
      this.stmt.reset();
      this.stmt.bind(params);
    }
    return this;
  }

  run(...params: any[]): { changes: number } {
    this.bind(...params);
    this.stmt.step();
    this.stmt.free();
    saveDatabase();
    return { changes: db.getRowsModified() };
  }

  get(...params: any[]): any {
    this.bind(...params);
    if (this.stmt.step()) {
      const row = this.stmt.getAsObject();
      this.stmt.free();
      return row;
    }
    this.stmt.free();
    return undefined;
  }

  all(...params: any[]): any[] {
    this.bind(...params);
    const rows: any[] = [];
    while (this.stmt.step()) {
      rows.push(this.stmt.getAsObject());
    }
    this.stmt.free();
    return rows;
  }

  free(): void {
    this.stmt.free();
  }
}

class DatabaseWrapper {
  prepare(sql: string): Statement {
    return new Statement(sql);
  }

  exec(sql: string): void {
    db.exec(sql);
    saveDatabase();
  }

  transaction<T>(fn: () => T): T {
    db.exec('BEGIN');
    try {
      const result = fn();
      db.exec('COMMIT');
      saveDatabase();
      return result;
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }
  }
}

let dbWrapper: DatabaseWrapper;

export async function initDatabase(): Promise<void> {
  SQL = await initSqlJs();

  const dbDir = path.dirname(config.dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Ensure upload directory exists
  if (!fs.existsSync(config.uploadDir)) {
    fs.mkdirSync(config.uploadDir, { recursive: true });
  }

  // Load existing database or create new one
  if (fs.existsSync(config.dbPath)) {
    const buffer = fs.readFileSync(config.dbPath);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  dbWrapper = new DatabaseWrapper();
}

export function getDb(): DatabaseWrapper {
  if (!dbWrapper) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return dbWrapper;
}

function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(config.dbPath, buffer);
}

export function closeDb(): void {
  if (db) {
    saveDatabase();
    db.close();
  }
}
