-- name: GetAllUsers :many
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users;

-- name: GetUser :one
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE id = ?;

-- name: GetUserName :one
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE username = ?;

-- name: AddUser :one
INSERT INTO Users(username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING *;

-- name: UpdateUser :one
UPDATE Users 
SET 
    username = COALESCE(sqlc.narg(username),username),
    password = COALESCE(sqlc.narg(password),password),
    firstname = COALESCE(?,firstname),
    lastname = COALESCE(?,lastname),
    company_id = COALESCE(?,company_id),
    jobsite_id = COALESCE(?,jobsite_id),
    role = COALESCE(?,role),
    email = COALESCE(sqlc.narg(email),email),
    phone = COALESCE(sqlc.narg(phone),phone),
    profilepicture = COALESCE(?,profilepicture)
WHERE id = ? RETURNING *;

-- name: UpdateUserCompany :one
UPDATE Users SET company_id = ? WHERE id = ? RETURNING *;

-- name: UpdateUserSite :one
UPDATE Users SET jobsite_id = ? WHERE id = ? RETURNING *;

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