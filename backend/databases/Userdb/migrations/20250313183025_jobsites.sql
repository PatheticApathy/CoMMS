-- +goose Up
-- +goose StatementBegin
CREATE TABLE JobSites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  addr TEXT,
  location_lat FLOAT,
  location_lng FLOAT,
  company_id INTEGER,
  FOREIGN KEY(company_id) REFERENCES Company(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE JobSites;
-- +goose StatementEnd