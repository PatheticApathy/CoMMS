-- name: GetAllJobSites :many
SELECT id, name, addr, location_lat, location_lng FROM JobSites;

-- name: GetAllJobSitesByCompany :many
SELECT id, name, addr, location_lat, location_lng FROM JobSites WHERE company_id=?;

-- name: GetJobSite :one
SELECT id, name, addr, location_lat, location_lng FROM JobSites WHERE id=?;

-- name: AddJobSite :one
INSERT INTO JobSites(name, addr, location_lat, location_lng, company_id) VALUES (?,?,?,?,?) RETURNING *;
