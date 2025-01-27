-- name: AddCheckoutLog :one
INSERT INTO CheckoutLogs(item_id,user_id,checkout_time)
VALUES (?,?,date())
RETURNING *;

-- name: UpdateCheckinlog :one
UPDATE CheckoutLogs
SET checkin_time = date()
WHERE id = ?
RETURNING *;

-- name: GetAllCheckoutLogs :one
SELECT * 
FROM  CheckoutLogs;
