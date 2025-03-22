-- +goose Up
-- +goose StatementBegin
CREATE TABLE Materials (
  id INTEGER Primary Key AUTOINCREMENT,
  name TEXT,
  type TEXT,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  status TEXT CHECK (status IN ("In Stock","Out of Stock","Low Stock")  ) NOT NULL,
  location_lat FLOAT,
  location_lng FLOAT,
  last_checked_out DATETIME,
  job_site INTEGER
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE Materials;
-- +goose StatementEnd
