-- name: AddCheckoutLog :one
INSERT INTO CheckoutLogs(item_id,user_id,checkout_time,amount)
VALUES (?,?,datetime('now'),?)
RETURNING *;

-- name: UpdateCheckinlog :one
UPDATE CheckoutLogs
SET checkin_time = datetime('now')
WHERE item_id = @item_id AND user_id = @user_id
RETURNING *;


-- name: GetAllCheckoutLogs :many
SELECT * 
FROM  CheckoutLogs;

-- name: GetRecentCheckoutLogsForMaterial :many
SELECT * 
FROM  CheckoutLogs
WHERE item_id = ?
ORDER BY checkout_time DESC
LIMIT 10;
