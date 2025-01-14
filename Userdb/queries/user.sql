-- name: GetAllUsers :many
SELECT id, username, site, role FROM Users;

-- name: GetUser :one
SELECT id, username, site, role FROM Users WHERE id = ?;

-- name: AddUser :one
INSERT INTO Users(username, site, role) VALUES (?,?,?) RETURNING *;