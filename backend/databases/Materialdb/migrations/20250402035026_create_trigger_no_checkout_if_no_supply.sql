-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER no_supply BEFORE INSERT ON CheckoutLogs 
FOR EACH ROW
WHEN (SELECT quantity FROM Materials WHERE id = new.item_id) = 0
BEGIN
  SELECT RAISE(ABORT, 'Cannot checkout, no more material');
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER no_supply;
-- +goose StatementEnd
