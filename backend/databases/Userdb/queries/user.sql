-- name: GetAllUsers :many
SELECT id, username, password, firstname, lastname, company, site, role, email, phone, profilepicture FROM Users;

-- name: GetUser :one
SELECT id, username, password, firstname, lastname, company, site, role, email, phone, profilepicture FROM Users WHERE id = ?;

-- name: AddUser :one
INSERT INTO Users(username, password, firstname, lastname, company, site, role, email, phone, profilepicture) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING *;

-- name: UpdateUserUsername :one
UPDATE Users SET username = ? WHERE id = ? RETURNING *;

-- name: UpdateUserPassword :one
UPDATE Users SET password = ? WHERE id = ? RETURNING *;

-- name: UpdateUserFirstname :one
UPDATE Users SET firstname = ? WHERE id = ? RETURNING *;

-- name: UpdateUserLastname :one
UPDATE Users SET lastname = ? WHERE id = ? RETURNING *;

-- name: UpdateUserCompany :one
UPDATE Users SET company = ? WHERE id = ? RETURNING *;

-- name: UpdateUserSite :one
UPDATE Users SET site = ? WHERE id = ? RETURNING *;

-- name: UpdateUserRole :one
UPDATE Users SET role = ? WHERE id = ? RETURNING *;

-- name: UpdateUserEmail :one
UPDATE Users SET email = ? WHERE id = ? RETURNING *;

-- name: UpdateUserPhone :one
UPDATE Users SET phone = ? WHERE id = ? RETURNING *;

-- name: UpdateUserProfilePicture :one
UPDATE Users SET profilepicture = ? WHERE id = ? RETURNING *;


-- name: DeleteUser :exec
DELETE FROM Users WHERE id = ?;

-- name: SignUp :one
INSERT INTO Users(username, password, email, phone) VALUES (?,?,?,?) RETURNING *;
