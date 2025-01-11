-- +goose Up
-- +goose StatementBegin
CREATE TABLE CheckoutLogs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  checkin_time DATE NOT NULL,
  checkout_time DATE NOT NULL,
  FOREIGN KEY(item_id) REFERENCES Materials(id),
  FOREIGN KEY(user_id) REFERENCES Users(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE CheckoutLogs;
-- +goose StatementEnd
