-- +goose Up
-- +goose StatementBegin
CREATE TABLE CheckoutLogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER,
  user_id INTEGER,
  checkin_time DATE,
  checkout_time DATE,
  FOREIGN KEY(item_id) REFERENCES Materials(id),
  FOREIGN KEY(user_id) REFERENCES Users(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE CheckoutLogs;
-- +goose StatementEnd
