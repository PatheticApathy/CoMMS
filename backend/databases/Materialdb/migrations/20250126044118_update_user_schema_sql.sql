-- +goose Up
-- +goose StatementBegin
ALTER TABLE Users DROP COLUMN username;
ALTER TABLE Users DROP COLUMN password;
ALTER TABLE Users DROP COLUMN role;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE Users ADD COLUMN username TEXT NOT NULL;
ALTER TABLE Users ADD COLUMN password TEXT NOT NULL;
ALTER TABLE Users ADD COLUMN role TEXT NOT NULL;
-- +goose StatementEnd
