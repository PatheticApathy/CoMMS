-- +goose Up
-- +goose StatementBegin
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstname TEXT,
  lastname TEXT,
  company_id INTEGER,
  jobsite_id INTEGER,
  role TEXT CHECK(role IN ('admin', 'user')),
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  profilepicture TEXT,
  FOREIGN KEY(company_id) REFERENCES Company(id),
  FOREIGN KEY(jobsite_id) REFERENCES JobSites(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Users;
-- +goose StatementEnd