-- name: GetAllUsers :many
SELECT id, username, site_id, role FROM Users;

-- name: GetUser :one
SELECT id, username, site_id, role FROM Users WHERE id = ?;

-- name: AddUser :one
INSERT INTO Users(username, site_id, role) VALUES (?,?,?) RETURNING *;
