-- name: GetAllUsers :many
SELECT id, username, name, company, site, role FROM Users;

-- name: GetUser :one
SELECT id, username, name, company, site, role FROM Users WHERE id = ?;

-- name: AddUser :one
INSERT INTO Users(username, password, name, company, site, role) VALUES (?,?,?,?,?,?) RETURNING *;

-- name: UpdateUser :one
UPDATE Users SET username = ?, password = ?, name = ?, company = ?, site = ?, role = ? WHERE id = ? RETURNING *;