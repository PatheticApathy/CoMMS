-- +goose Up
-- +goose StatementBegin
CREATE TABLE JobSites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  addr TEXT,
  location_lat FLOAT,
  location_lng FLOAT
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE JobSites;
-- +goose StatementEnd

