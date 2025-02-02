-- +goose Up
-- +goose StatementBegin
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstname TEXT,
  lastname TEXT,
  company TEXT,
  site TEXT,
  role TEXT CHECK(role IN ('admin', 'user')),
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Users;
-- +goose StatementEnd
