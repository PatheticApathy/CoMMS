-- name: GetUserAndPass :one
SELECT username, password, id, role FROM Users WHERE username = ?;
