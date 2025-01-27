-- +goose Up
-- +goose StatementBegin
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  company TEXT NOT NULL,
  site TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user')),
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Users;
-- +goose StatementEnd
