-- +goose Up
-- +goose StatementBegin
ALTER TABLE Materials ADD COLUMN picture TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE Materials DROP COLUMN picture;
-- +goose StatementEnd
