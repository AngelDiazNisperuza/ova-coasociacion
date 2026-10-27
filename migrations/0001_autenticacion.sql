-- Coasocia: cuentas seudónimas, sesiones y códigos de clase.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, username TEXT NOT NULL COLLATE NOCASE UNIQUE,
 role TEXT NOT NULL CHECK(role IN ('estudiante','docente')),
 password_hash TEXT NOT NULL, salt TEXT NOT NULL, iterations INTEGER NOT NULL,
 class_id TEXT, active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS classes (
 id TEXT PRIMARY KEY, teacher_id TEXT NOT NULL REFERENCES users(id),
 name TEXT NOT NULL, join_code_hash TEXT NOT NULL UNIQUE,
 active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
CREATE TABLE IF NOT EXISTS auth_failures (
 key TEXT PRIMARY KEY, fails INTEGER NOT NULL DEFAULT 0, reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_users_class ON users(class_id);
