-- name: GetAllMaterialLogs :many
SELECT id, material_id, note, status, quantity_change, timestamp FROM MaterialLogs;

-- name: GetMaterialLogsByID :one
SELECT id, material_id, note, status, quantity_change, timestamp
FROM MaterialLogs
WHERE id = ?;

-- name: GetMaterialLogsByMaterial :many
SELECT id, material_id, note, status, quantity_change, timestamp
FROM MaterialLogs
WHERE material_id = ?;

-- name: AddMaterialLog :one
INSERT 
INTO MaterialLogs(material_id, note, status, quantity_change,timestamp)
VALUES (?,?,?,?,date()) 
RETURNING *;


-- name: ChangeMaterialNote :one
UPDATE MaterialLogs 
  SET note = ?
  WHERE id = ? 
RETURNING *;
