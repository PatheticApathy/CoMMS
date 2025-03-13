-- name: AddCheckoutLog :one
INSERT INTO CheckoutLogs(item_id,user_id,checkout_time)
VALUES (?,?,date())
RETURNING *;

-- name: UpdateCheckinlog :one
UPDATE CheckoutLogs
SET checkin_time = date()
WHERE id = ?
RETURNING *;


-- name: GetAllCheckoutLogs :many
SELECT * 
FROM  CheckoutLogs;

-- name: GetRecentCheckoutLogsForMaterial :many
SELECT * 
FROM  CheckoutLogs
WHERE item_id = ?
ORDER BY checkout_time
LIMIT 10;
