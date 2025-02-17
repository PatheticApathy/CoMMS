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

-- name: GetRecentMaterialLogsForMaterial :many
SELECT * 
FROM  MaterialLogs
WHERE material_id = ?
ORDER BY timestamp
LIMIT 10;

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
