-- +goose Up
-- +goose StatementBegin
CREATE TABLE CheckoutLogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  checkin_time DATETIME ,
  checkout_time DATETIME NOT NULL,
  FOREIGN KEY(item_id) REFERENCES Materials(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE CheckoutLogs;
-- +goose StatementEnd
