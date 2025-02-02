// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: user.sql

package materialdb

import (
	"context"
	"database/sql"
)

const addUser = `-- name: AddUser :one
INSERT INTO Users(id,site_id) VALUES (?,?) RETURNING id, site_id
`

type AddUserParams struct {
	ID     int64         `json:"id"`
	SiteID sql.NullInt64 `json:"site_id"`
}

func (q *Queries) AddUser(ctx context.Context, arg AddUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, addUser, arg.ID, arg.SiteID)
	var i User
	err := row.Scan(&i.ID, &i.SiteID)
	return i, err
}

const getAllUsers = `-- name: GetAllUsers :many
SELECT id,site_id FROM Users
`

func (q *Queries) GetAllUsers(ctx context.Context) ([]User, error) {
	rows, err := q.db.QueryContext(ctx, getAllUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []User
	for rows.Next() {
		var i User
		if err := rows.Scan(&i.ID, &i.SiteID); err != nil {
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

const getUser = `-- name: GetUser :one
SELECT id, site_id FROM Users WHERE id = ?
`

func (q *Queries) GetUser(ctx context.Context, id int64) (User, error) {
	row := q.db.QueryRowContext(ctx, getUser, id)
	var i User
	err := row.Scan(&i.ID, &i.SiteID)
	return i, err
}
