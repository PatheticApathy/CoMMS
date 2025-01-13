-- +goose Up
-- +goose StatementBegin
CREATE TABLE Permissions (
  permission INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  descripion TEXT NOT NULL
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Permissions;
-- +goose StatementEnd
