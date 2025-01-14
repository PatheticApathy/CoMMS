-- name: GetUserAndPass :one
SELECT password FROM Users WHERE username = ?;