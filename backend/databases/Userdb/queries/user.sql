-- name: GetAllUsers :many
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users;

-- name: GetUser :one
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE id = ?;

-- name: GetUserName :one
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE username = ?;

-- name: AddUser :one
INSERT INTO Users(username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING *;

-- name: DeleteUser :exec
DELETE FROM Users WHERE id = ?;

-- name: SignUp :one
INSERT INTO Users(username, password, email, phone) VALUES (?,?,?,?) RETURNING *;
