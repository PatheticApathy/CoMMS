-- name: GetAllMaterials :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out, picture FROM Materials;

-- name: GetMaterialsByType :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site , last_checked_out, picture FROM Materials WHERE type=?;

-- name: GetMaterialsBySite :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out, picture FROM Materials WHERE job_site=?;

-- name: GetMaterialsByID :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out, picture FROM Materials WHERE id=?;

-- name: GetMaterialsByQuantity :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out, picture
FROM Materials 
WHERE quantity=? AND unit=?;

-- name: GetMaterialsByJobsiteID :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out, picture
FROM Materials
WHERE job_site=?;

-- name: AddMaterial :one
INSERT INTO Materials(name,type,quantity,unit,status,location_lat,location_lng,job_site, picture)
VALUES (?,?,?,?,?,?,?,?,?)
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

-- name: GetMaterialsWithLogs :many
SELECT m.id, m.name, m.type, m.quantity, m.unit, m.status, m.location_lat, m.location_lng, m.job_site, m.last_checked_out, m.picture, 
l.timestamp
FROM Materials m JOIN MaterialLogs l ON m.id = l.material_id;
