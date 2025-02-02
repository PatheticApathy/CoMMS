-- +goose Up
-- +goose StatementBegin
CREATE TABLE MaterialLogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  material_id INTEGER NOT NULL,
  note TEXT,
  status TEXT CHECK (status IN ("In Stock","Out of Stock","Low Stock")  )NOT NULL,
  quantity_change INTEGER NOT NULL,
  timestamp DATE NOT NULL,
  FOREIGN KEY(material_id) REFERENCES Materials(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE MaterialLogs;
-- +goose StatementEnd
