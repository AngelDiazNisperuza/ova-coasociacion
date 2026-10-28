-- Ejecutar este bloque en Console de ova-coasociacion-db.
-- Conserva todos los usuarios y sesiones existentes.
CREATE TABLE IF NOT EXISTS activity_progress (
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 activity_id TEXT NOT NULL,
 data TEXT NOT NULL,
 updated_at INTEGER NOT NULL,
 PRIMARY KEY (user_id,activity_id)
);
