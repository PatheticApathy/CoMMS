-- +goose Up
-- +goose StatementBegin
CREATE TABLE MaterialLogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id INTEGER,
  note TEXT,
  status TEXT,
  quantity_change INTEGER,
  timestamp DATE,
  FOREIGN KEY(material_id) REFERENCES Materials(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE MaterialLogs;
-- +goose StatementEnd
