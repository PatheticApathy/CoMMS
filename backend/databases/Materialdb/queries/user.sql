-- name: GetAllUsers :many
SELECT id,site_id FROM Users;

-- name: GetUser :one
SELECT id, site_id FROM Users WHERE id = ?;

-- name: AddUser :one
INSERT INTO Users(id,site_id) VALUES (?,?) RETURNING *;
