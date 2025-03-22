// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: checkout.sql

package materialdb

import (
	"context"
)

const addCheckoutLog = `-- name: AddCheckoutLog :one
INSERT INTO CheckoutLogs(item_id,user_id,checkout_time,amount)
VALUES (?,?,datetime('now'),?)
RETURNING id, item_id, user_id, checkin_time, checkout_time, amount
`

type AddCheckoutLogParams struct {
	ItemID int64       `json:"item_id"`
	UserID int64       `json:"user_id"`
	Amount interface{} `json:"amount"`
}

func (q *Queries) AddCheckoutLog(ctx context.Context, arg AddCheckoutLogParams) (CheckoutLog, error) {
	row := q.db.QueryRowContext(ctx, addCheckoutLog, arg.ItemID, arg.UserID, arg.Amount)
	var i CheckoutLog
	err := row.Scan(
		&i.ID,
		&i.ItemID,
		&i.UserID,
		&i.CheckinTime,
		&i.CheckoutTime,
		&i.Amount,
	)
	return i, err
}

const getAllCheckoutLogs = `-- name: GetAllCheckoutLogs :many
SELECT id, item_id, user_id, checkin_time, checkout_time, amount 
FROM  CheckoutLogs
`

func (q *Queries) GetAllCheckoutLogs(ctx context.Context) ([]CheckoutLog, error) {
	rows, err := q.db.QueryContext(ctx, getAllCheckoutLogs)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []CheckoutLog
	for rows.Next() {
		var i CheckoutLog
		if err := rows.Scan(
			&i.ID,
			&i.ItemID,
			&i.UserID,
			&i.CheckinTime,
			&i.CheckoutTime,
			&i.Amount,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const getRecentCheckoutLogsForMaterial = `-- name: GetRecentCheckoutLogsForMaterial :many
SELECT id, item_id, user_id, checkin_time, checkout_time, amount 
FROM  CheckoutLogs
WHERE item_id = ?
ORDER BY checkout_time DESC
LIMIT 10
`

func (q *Queries) GetRecentCheckoutLogsForMaterial(ctx context.Context, itemID int64) ([]CheckoutLog, error) {
	rows, err := q.db.QueryContext(ctx, getRecentCheckoutLogsForMaterial, itemID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []CheckoutLog
	for rows.Next() {
		var i CheckoutLog
		if err := rows.Scan(
			&i.ID,
			&i.ItemID,
			&i.UserID,
			&i.CheckinTime,
			&i.CheckoutTime,
			&i.Amount,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}

const updateCheckinlog = `-- name: UpdateCheckinlog :one
UPDATE CheckoutLogs
SET checkin_time = datetime('now')
WHERE item_id = ?1 AND user_id = ?2
RETURNING id, item_id, user_id, checkin_time, checkout_time, amount
`

type UpdateCheckinlogParams struct {
	ItemID int64 `json:"item_id"`
	UserID int64 `json:"user_id"`
}

func (q *Queries) UpdateCheckinlog(ctx context.Context, arg UpdateCheckinlogParams) (CheckoutLog, error) {
	row := q.db.QueryRowContext(ctx, updateCheckinlog, arg.ItemID, arg.UserID)
	var i CheckoutLog
	err := row.Scan(
		&i.ID,
		&i.ItemID,
		&i.UserID,
		&i.CheckinTime,
		&i.CheckoutTime,
		&i.Amount,
	)
	return i, err
}
