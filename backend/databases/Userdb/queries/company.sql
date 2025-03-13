-- name: AddCompany :one
INSERT INTO Company(name, addr, location_lat, location_lng) VALUES (?, ?, ?, ?) RETURNING *;