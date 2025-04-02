-- +goose Up
-- +goose StatementBegin
ALTER TABLE CheckoutLogs ADD COLUMN checkout_picture TEXT NOT NULL DEFAULT "file.svg";
ALTER TABLE CheckoutLogs ADD COLUMN checkin_picture TEXT NOT NULL DEFAULT "file.svg";
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE CheckoutLogs DROP COLUMN checkout_picture;
ALTER TABLE CheckoutLogs DROP COLUMN checkin_picture;
-- +goose StatementEnd
