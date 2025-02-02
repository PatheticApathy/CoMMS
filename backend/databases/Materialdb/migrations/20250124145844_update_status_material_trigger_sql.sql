-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER materials_status_change AFTER UPDATE ON Materials
FOR EACH ROW
BEGIN
  UPDATE Materials 
  SET status = CASE
    WHEN quantity <= 0 THEN 'Out of Stock'
    WHEN quantity < 30 THEN 'Low Stock'
    ELSE old.status
  END
  WHERE id = new.id;
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER materials_status_change;
-- +goose StatementEnd
