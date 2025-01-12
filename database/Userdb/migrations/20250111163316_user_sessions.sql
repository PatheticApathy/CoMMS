-- +goose Up
-- +goose StatementBegin
CREATE TABLE User_Sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  ip_address VARCHAR(45),
  device_info TEXT,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  FOREIGN KEY(user_id) REFERENCES Users(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE User_Sessions;
-- +goose StatementEnd
