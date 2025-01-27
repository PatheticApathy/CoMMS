-- +goose Up
-- +goose StatementBegin
CREATE TABLE Users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  site_id INTEGER,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NUll,
  FOREIGN KEY(site_id) REFERENCES JobSite(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Users;
-- +goose StatementEnd
