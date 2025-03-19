-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER update_last_chscked_out AFTER INSERT ON CheckoutLogs 
FOR EACH ROW
BEGIN
  UPDATE Materials
    SET last_checked_out = NEW.checkout_time
  WHERE id = NEW.item_id;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_last_chscked_out;
-- +goose StatementEnd
