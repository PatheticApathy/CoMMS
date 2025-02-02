-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER material_creation_log AFTER INSERT ON Materials
BEGIN
  INSERT 
  INTO MaterialLogs(material_id, note, status, quantity_change,timestamp)
  VALUES (new.id,'Created',new.status,new.quantity,date()); 
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER material_creation_log;
-- +goose StatementEnd
