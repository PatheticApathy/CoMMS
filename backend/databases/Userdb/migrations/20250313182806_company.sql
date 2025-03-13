-- +goose Up
-- +goose StatementBegin
CREATE TABLE Company (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  addr TEXT,
  location_lat FLOAT,
  location_lng FLOAT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Company;
-- +goose StatementEnd