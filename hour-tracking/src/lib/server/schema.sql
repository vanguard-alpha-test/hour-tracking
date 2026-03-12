-- Baseline schema for the hour-tracking application.
-- All statements use CREATE TABLE IF NOT EXISTS so this file is safe
-- to re-run on every server startup (idempotent).

CREATE TABLE IF NOT EXISTS time_entries (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        TEXT    NOT NULL,               -- ISO 8601 date: YYYY-MM-DD
    project     TEXT    NOT NULL,
    description TEXT    NOT NULL DEFAULT '',
    hours       REAL    NOT NULL CHECK (hours > 0),
    created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- Index to speed up date-range queries (the most common filter).
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries (date);

-- Index to speed up per-project aggregations.
CREATE INDEX IF NOT EXISTS idx_time_entries_project ON time_entries (project);
