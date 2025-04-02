-- name: GetAllUsers :many
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users;

-- name: GetUser :one
SELECT id, username, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE id = ?;

-- name: GetUserName :one
SELECT id, username, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE username = ?;

-- name: AddUser :one
INSERT INTO Users(username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING *;

-- name: DeleteUser :exec
DELETE FROM Users WHERE id = ?;

-- name: SignUp :one
INSERT INTO Users(username, password, email, phone) VALUES (?,?,?,?) RETURNING *;

-- name: GetUsersWithCompanyAndJobsite :many
SELECT u.id, u.username, u.firstname, u.lastname, u.company_id, u.jobsite_id, u.role, u.email, u.phone, u.profilepicture, 
c.name as company_name, j.name as jobsite_name
FROM Users u JOIN Companies c ON u.company_id = c.id JOIN JobSites j ON u.jobsite_id = j.id;

-- name: GetUsersByJobsiteAndCompany :many
SELECT u.username, u.firstname, u.lastname, u.company_id, u.jobsite_id, u.role, u.email, u.phone, u.profilepicture,
       c.name as company_name, j.name as jobsite_name
FROM Users u 
JOIN Companies c ON u.company_id = c.id 
JOIN JobSites j ON u.jobsite_id = j.id
WHERE ? = u.company_id 
    OR  u.jobsite_id = ?
    AND u.id != ?;