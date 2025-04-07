-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER material_update_log AFTER UPDATE ON Materials
WHEN (old.quantity != new.quantity)
BEGIN
    INSERT 
    INTO MaterialLogs(material_id, note, status, quantity_change,timestamp)
    VALUES (new.id,'Quantity change',new.status,new.quantity - old.quantity,datetime('now'));
END;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER material_update_log
-- +goose StatementEnd
