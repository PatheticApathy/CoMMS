-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER update_picture_on_checkin AFTER UPDATE ON CheckoutLogs 
FOR EACH ROW
BEGIN
  UPDATE Materials
    SET  picture=NEW.checkout_picture
  WHERE id = NEW.item_id;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER update_picture_on_checkin;
-- +goose StatementEnd

