-- +goose Up
-- +goose StatementBegin
CREATE TABLE Companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  addr TEXT,
  location_lat FLOAT,
  location_lng FLOAT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Companies;
-- +goose StatementEnd