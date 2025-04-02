-- +goose Up
-- +goose StatementBegin
ALTER TABLE CheckoutLogs ADD COLUMN checkout_picture TEXT;
ALTER TABLE CheckoutLogs ADD COLUMN checkin_picture TEXT;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE CheckoutLogs DROP COLUMN checkout_picture;
ALTER TABLE CheckoutLogs DROP COLUMN checkin_picture;
-- +goose StatementEnd
