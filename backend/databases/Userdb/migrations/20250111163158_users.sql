-- +goose Up
-- +goose StatementBegin
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstname TEXT,
  lastname TEXT,
  company INTEGER,
  role TEXT CHECK(role IN ('admin', 'user')),
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  profilepicture TEXT,
  FOREIGN KEY(company_id) REFERENCES Company(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Users;
-- +goose StatementEnd