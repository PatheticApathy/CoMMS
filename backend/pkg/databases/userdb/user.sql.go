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
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE id = ?
`

func (q *Queries) GetUser(ctx context.Context, id int64) (User, error) {
	row := q.db.QueryRowContext(ctx, getUser, id)
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

const getUserName = `-- name: GetUserName :one
SELECT id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture FROM Users WHERE username = ?
`

func (q *Queries) GetUserName(ctx context.Context, username string) (User, error) {
	row := q.db.QueryRowContext(ctx, getUserName, username)
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

const updateUserCompany = `-- name: UpdateUserCompany :one
UPDATE Users SET company_id = ? WHERE id = ? RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type UpdateUserCompanyParams struct {
	CompanyID sql.NullInt64 `json:"company_id"`
	ID        int64         `json:"id"`
}

func (q *Queries) UpdateUserCompany(ctx context.Context, arg UpdateUserCompanyParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserCompany, arg.CompanyID, arg.ID)
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

const updateUserEmail = `-- name: UpdateUserEmail :one
UPDATE Users SET email = ? WHERE id = ? RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type UpdateUserEmailParams struct {
	Email string `json:"email"`
	ID    int64  `json:"id"`
}

func (q *Queries) UpdateUserEmail(ctx context.Context, arg UpdateUserEmailParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserEmail, arg.Email, arg.ID)
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

const updateUserPhone = `-- name: UpdateUserPhone :one
UPDATE Users SET phone = ? WHERE id = ? RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type UpdateUserPhoneParams struct {
	Phone string `json:"phone"`
	ID    int64  `json:"id"`
}

func (q *Queries) UpdateUserPhone(ctx context.Context, arg UpdateUserPhoneParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserPhone, arg.Phone, arg.ID)
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

const updateUserProfilePicture = `-- name: UpdateUserProfilePicture :one
UPDATE Users SET profilepicture = ? WHERE id = ? RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type UpdateUserProfilePictureParams struct {
	Profilepicture sql.NullString `json:"profilepicture"`
	ID             int64          `json:"id"`
}

func (q *Queries) UpdateUserProfilePicture(ctx context.Context, arg UpdateUserProfilePictureParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserProfilePicture, arg.Profilepicture, arg.ID)
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

const updateUserRole = `-- name: UpdateUserRole :one
UPDATE Users SET role = ? WHERE id = ? RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type UpdateUserRoleParams struct {
	Role sql.NullString `json:"role"`
	ID   int64          `json:"id"`
}

func (q *Queries) UpdateUserRole(ctx context.Context, arg UpdateUserRoleParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserRole, arg.Role, arg.ID)
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

const updateUserSite = `-- name: UpdateUserSite :one
UPDATE Users SET jobsite_id = ? WHERE id = ? RETURNING id, username, password, firstname, lastname, company_id, jobsite_id, role, email, phone, profilepicture
`

type UpdateUserSiteParams struct {
	JobsiteID sql.NullInt64 `json:"jobsite_id"`
	ID        int64         `json:"id"`
}

func (q *Queries) UpdateUserSite(ctx context.Context, arg UpdateUserSiteParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUserSite, arg.JobsiteID, arg.ID)
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
