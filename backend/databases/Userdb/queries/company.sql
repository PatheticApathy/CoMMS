-- name: AddCompany :one
INSERT INTO Companies(name, addr, location_lat, location_lng) VALUES (?, ?, ?, ?) RETURNING *;

-- name: GetCompany :one
SELECT id, name, addr, location_lat, location_lng FROM Companies WHERE id = ?;

-- name: GetAllCompanies :many
SELECT id, name, addr, location_lat, location_lng FROM Companies;