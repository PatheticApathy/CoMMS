-- name: GetAllUsers :many
SELECT id, username, firstname, lastname, company, site, role, email, phone FROM Users;

-- name: GetUser :one
SELECT id, username, firstname, lastname, company, site, role, email, phone FROM Users WHERE id = ?;

-- name: AddUser :one
INSERT INTO Users(username, password, firstname, lastname, company, site, role, email, phone) VALUES (?,?,?,?,?,?,?,?,?) RETURNING *;

-- name: UpdateUser :one
UPDATE Users SET username = ?, password = ?, firstname = ?, lastname = ?, company = ?, site = ?, role = ?, email = ?, phone = ? WHERE id = ? RETURNING *;

-- name: DeleteUser :exec
DELETE FROM Users WHERE id = ?;

-- name: SignUp :one
INSERT INTO Users(username, password, email, phone) VALUES (?,?,?,?) RETURNING *;