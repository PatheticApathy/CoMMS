// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: user.sql

package user_db

import (
	"context"
)

const addUser = `-- name: AddUser :one
INSERT INTO Users(username, site, role) VALUES (?,?,?) RETURNING id, username, password, name, company, site, role, created_at
`

type AddUserParams struct {
	Username string
	Site     string
	Role     string
}

func (q *Queries) AddUser(ctx context.Context, arg AddUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, addUser, arg.Username, arg.Site, arg.Role)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Password,
		&i.Name,
		&i.Company,
		&i.Site,
		&i.Role,
		&i.CreatedAt,
	)
	return i, err
}

const getAllUsers = `-- name: GetAllUsers :many
SELECT id, username, site, role FROM Users
`

type GetAllUsersRow struct {
	ID       int64
	Username string
	Site     string
	Role     string
}

func (q *Queries) GetAllUsers(ctx context.Context) ([]GetAllUsersRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllUsers)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllUsersRow
	for rows.Next() {
		var i GetAllUsersRow
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.Site,
			&i.Role,
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

const getUser = `-- name: GetUser :one
SELECT id, username, site, role FROM Users WHERE id = ?
`

type GetUserRow struct {
	ID       int64
	Username string
	Site     string
	Role     string
}

func (q *Queries) GetUser(ctx context.Context, id int64) (GetUserRow, error) {
	row := q.db.QueryRowContext(ctx, getUser, id)
	var i GetUserRow
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Site,
		&i.Role,
	)
	return i, err
}
