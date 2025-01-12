-- +goose Up
-- +goose StatementBegin
CREATE TABLE Role_Permissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role_id INTEGER,
  permission_id INTEGER,
  FOREIGN KEY(role_id) REFERENCES Roles(role),
  FOREIGN KEY(permission_id) REFERENCES Permissions(permission)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Role_Permissions;
-- +goose StatementEnd
