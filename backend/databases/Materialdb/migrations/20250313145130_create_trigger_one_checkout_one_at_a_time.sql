-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER one_at_a_time BEFORE INSERT ON CheckoutLogs
FOR EACH ROW
WHEN EXISTS (
 SELECT * FROM CheckoutLogs
 WHERE checkin_time IS NULL 
  AND user_id = NEW.user_id
  AND itemid = NEW.item_id
) 
BEGIN
  SELECT RAISE(ABORT, 'Error: Cannot checkout material that you have not checked back in');
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER one_at_a_time;
-- +goose StatementEnd
