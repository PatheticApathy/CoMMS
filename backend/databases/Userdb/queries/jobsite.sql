-- name: AddJobsite :one
INSERT INTO JobSites(name, addr, location_lat, location_lng, company_id) VALUES (?,?,?,?,?) RETURNING *;