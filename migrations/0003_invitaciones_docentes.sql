-- Ejecutar en la consola D1 de ova-coasociacion-db, después de crear activity_progress.
CREATE TABLE IF NOT EXISTS teacher_invites (
 id TEXT PRIMARY KEY,
 code_hash TEXT NOT NULL UNIQUE,
 created_by TEXT NOT NULL REFERENCES users(id),
 used_by TEXT REFERENCES users(id),
 expires_at INTEGER NOT NULL,
 used_at INTEGER,
 created_at INTEGER NOT NULL
);
