-- name: AddCompany :one
INSERT INTO Companies(name, addr, location_lat, location_lng) VALUES (?, ?, ?, ?) RETURNING *;