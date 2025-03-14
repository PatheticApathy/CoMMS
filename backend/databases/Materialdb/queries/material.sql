-- name: GetAllMaterials :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out FROM Materials;

-- name: GetMaterialsByType :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site , last_checked_out FROM Materials WHERE type=?;

-- name: GetMaterialsBySite :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out FROM Materials WHERE job_site=?;

-- name: GetMaterialsByID :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out FROM Materials WHERE id=?;

-- name: GetMaterialsByQuantity :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out
FROM Materials 
WHERE quantity=? AND unit=?;

-- name: AddMaterial :one
INSERT INTO Materials(name,type,quantity,unit,status,location_lat,location_lng,job_site)
VALUES (?,?,?,?,?,?,?,?)
RETURNING *;

-- name: ChangeQuantity :one
UPDATE Materials
  SET quantity = ?
  WHERE  id = ?
RETURNING *;

-- name: ChangeStatus :one
UPDATE Materials
  SET status = ?
  WHERE  id = ?
RETURNING *;

-- name: DeleteMaterial :one
DELETE FROM Materials
WHERE id = ?
RETURNING *;
