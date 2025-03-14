package userdb

import (
	"context"
	"database/sql"
)

const updateUser = `
UPDATE Users 
SET 
    username = COALESCE(?,username),
    password = COALESCE(?,password),
    firstname = COALESCE(?,firstname),
    lastname = COALESCE(?,lastname),
    company_id = COALESCE(?,company_id),
    jobsite_id = COALESCE(?,jobsite_id),
    role = COALESCE(?,role),
    email = COALESCE(?,email),
    phone = COALESCE(?,phone),
    profilepicture = COALESCE(?,profilepicture)
WHERE id = ? RETURNING *;
`

type UpdateUserParams struct {
	Username       sql.NullString `json:"username"`
	Password       sql.NullString `json:"password"`
	Firstname      sql.NullString `json:"firstname"`
	Lastname       sql.NullString `json:"lastname"`
	CompanyID      sql.NullInt64  `json:"company_id"`
	JobsiteID      sql.NullInt64  `json:"jobsite_id"`
	Role           sql.NullString `json:"role"`
	Email          sql.NullString `json:"email"`
	Phone          sql.NullString `json:"phone"`
	Profilepicture sql.NullString `json:"profilepicture"`
	ID             int64          `json:"id"`
}

func (q *Queries) UpdateUser(ctx context.Context, arg UpdateUserParams) (User, error) {
	row := q.db.QueryRowContext(ctx, updateUser,
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
		arg.ID,
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
