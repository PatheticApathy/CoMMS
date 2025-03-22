// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: user.sql

package userdb

import (
	"context"
	"database/sql"
)

const addUser = `-- name: AddUser :one
INSERT INTO Users(username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture) VALUES (?,?,?,?,?,?,?,?,?,?) RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type AddUserParams struct {
	Username       string         `json:"username"`
	Password       string         `json:"password"`
	Firstname      sql.NullString `json:"firstname"`
	Lastname       sql.NullString `json:"lastname"`
	CompanyID      sql.NullInt64  `json:"company_id"`
	JobsiteID      sql.NullInt64  `json:"jobsite_id"`
	Role           sql.NullString `json:"role"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	Profilepicture sql.NullString `json:"profilepicture"`
}

func (q *Queries) AddUser(ctx context.Context, arg AddUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, addUser,
		arg.Username,
		arg.Password,
		arg.Firstname,
		arg.Lastname,
		arg.CompanyID,
		arg.JobsiteID,
		arg.Role,
		arg.Email,
		arg.Phone,
		arg.Profilepicture,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Password,
		&i.Firstname,
		&i.Lastname,
		&i.CompanyID,
		&i.JobsiteID,
		&i.Role,
		&i.Email,
		&i.Phone,
		&i.Profilepicture,
	)
	return i, err
}

const deleteUser = `-- name: DeleteUser :exec
DELETE FROM Users WHERE id = ?
`

func (q *Queries) DeleteUser(ctx context.Context, id int64) error {
	_, err := q.db.ExecContext(ctx, deleteUser, id)
	return err
}

const getAllUsers = `-- name: GetAllUsers :many
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users
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
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.Password,
			&i.Firstname,
			&i.Lastname,
			&i.CompanyID,
			&i.JobsiteID,
			&i.Role,
			&i.Email,
			&i.Phone,
			&i.Profilepicture,
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

SELECT id, username, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE id = ?


type GetUserRow struct {
	ID             int64          `json:"id"`
	Username       string         `json:"username"`
	Firstname      sql.NullString `json:"firstname"`
	Lastname       sql.NullString `json:"lastname"`
	CompanyID      sql.NullInt64  `json:"company_id"`
	JobsiteID      sql.NullInt64  `json:"jobsite_id"`
	Role           sql.NullString `json:"role"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	Profilepicture sql.NullString `json:"profilepicture"`
}

func (q *Queries) GetUser(ctx context.Context, id int64) (GetUserRow, error) {
	row := q.db.QueryRowContext(ctx, getUser, id)
	var i GetUserRow
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Firstname,
		&i.Lastname,
		&i.CompanyID,
		&i.JobsiteID,
		&i.Role,
		&i.Email,
		&i.Phone,
		&i.Profilepicture,
	)
	return i, err
}

const getUserName = `-- name: GetUserName :one
SELECT id, username, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE username = ?
`

type GetUserNameRow struct {
	ID             int64          `json:"id"`
	Username       string         `json:"username"`
	Firstname      sql.NullString `json:"firstname"`
	Lastname       sql.NullString `json:"lastname"`
	CompanyID      sql.NullInt64  `json:"company_id"`
	JobsiteID      sql.NullInt64  `json:"jobsite_id"`
	Role           sql.NullString `json:"role"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	Profilepicture sql.NullString `json:"profilepicture"`
}

func (q *Queries) GetUserName(ctx context.Context, username string) (GetUserNameRow, error) {
	row := q.db.QueryRowContext(ctx, getUserName, username)
	var i GetUserNameRow
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Firstname,
		&i.Lastname,
		&i.CompanyID,
		&i.JobsiteID,
		&i.Role,
		&i.Email,
		&i.Phone,
		&i.Profilepicture,
	)
	return i, err
}

const getUsersWithCompanyAndJobsite = `-- name: GetUsersWithCompanyAndJobsite :many
SELECT u.id, u.username, u.password, u.firstname, u.lastname, u.company_id, u.jobsite_id, u.role, u.email, u.phone, u.profilepicture, 
c.name as company_name, j.name as jobsite_name
FROM Users u JOIN Companies c ON u.company_id = c.id JOIN JobSites j ON u.jobsite_id = j.id
`

type GetUsersWithCompanyAndJobsiteRow struct {
	ID             int64          `json:"id"`
	Username       string         `json:"username"`
	Password       string         `json:"password"`
	Firstname      sql.NullString `json:"firstname"`
	Lastname       sql.NullString `json:"lastname"`
	CompanyID      sql.NullInt64  `json:"company_id"`
	JobsiteID      sql.NullInt64  `json:"jobsite_id"`
	Role           sql.NullString `json:"role"`
	Email          string         `json:"email"`
	Phone          string         `json:"phone"`
	Profilepicture sql.NullString `json:"profilepicture"`
	CompanyName    string         `json:"company_name"`
	JobsiteName    string         `json:"jobsite_name"`
}

func (q *Queries) GetUsersWithCompanyAndJobsite(ctx context.Context) ([]GetUsersWithCompanyAndJobsiteRow, error) {
	rows, err := q.db.QueryContext(ctx, getUsersWithCompanyAndJobsite)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetUsersWithCompanyAndJobsiteRow
	for rows.Next() {
		var i GetUsersWithCompanyAndJobsiteRow
		if err := rows.Scan(
			&i.ID,
			&i.Username,
			&i.Password,
			&i.Firstname,
			&i.Lastname,
			&i.CompanyID,
			&i.JobsiteID,
			&i.Role,
			&i.Email,
			&i.Phone,
			&i.Profilepicture,
			&i.CompanyName,
			&i.JobsiteName,
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

const signUp = `-- name: SignUp :one
INSERT INTO Users(username, password, email, phone) VALUES (?,?,?,?) RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type SignUpParams struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

func (q *Queries) SignUp(ctx context.Context, arg SignUpParams) (User, error) {
	row := q.db.QueryRowContext(ctx, signUp,
		arg.Username,
		arg.Password,
		arg.Email,
		arg.Phone,
	)
	var i User
	err := row.Scan(
		&i.ID,
		&i.Username,
		&i.Password,
		&i.Firstname,
		&i.Lastname,
		&i.CompanyID,
		&i.JobsiteID,
		&i.Role,
		&i.Email,
		&i.Phone,
		&i.Profilepicture,
	)
	return i, err
}
