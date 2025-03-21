-- +goose Up
-- +goose StatementBegin
ALTER TABLE CheckoutLogs ADD COLUMN amount NOT NULL DEFAULT 0;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE CheckoutLogs DROP COLUMN amount;
-- +goose StatementEnd
