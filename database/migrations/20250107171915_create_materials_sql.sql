-- +goose Up
-- +goose StatementBegin
CREATE TABLE Materials (
  id INTEGER Primary Key AUTOINCREMENT,
  name TEXT,
  type TEXT,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,
  location_lat FLOAT,
  location_lng FLOAT,
  last_checked_out DATEIME,
  job_site INTEGER,
  FOREIGN KEY(job_site) REFERENCES JobSites(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Materials;
-- +goose StatementEnd
