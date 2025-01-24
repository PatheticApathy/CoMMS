-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER material_deletion_log BEFORE DELETE ON Materials
BEGIN
  INSERT 
  INTO MaterialLogs(material_id, note, status, quantity_change,timestamp)
  VALUES (old.id,"Deleted",old.status,old.quantity,date());
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER material_deletion_log;
-- +goose StatementEnd
