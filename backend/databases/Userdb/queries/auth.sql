-- name: GetUserAndPass :one
SELECT password, id FROM Users WHERE username = ?;
