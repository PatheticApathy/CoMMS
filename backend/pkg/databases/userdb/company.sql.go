// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: company.sql

package userdb

import (
	"context"
	"database/sql"
)

const addCompany = `-- name: AddCompany :one
INSERT INTO Company(name, addr, location_lat, location_lng) VALUES (?, ?, ?, ?) RETURNING id, name, addr, location_lat, location_lng
`

type AddCompanyParams struct {
	Name        string          `json:"name"`
	Addr        sql.NullString  `json:"addr"`
	LocationLat sql.NullFloat64 `json:"location_lat"`
	LocationLng sql.NullFloat64 `json:"location_lng"`
}

func (q *Queries) AddCompany(ctx context.Context, arg AddCompanyParams) (Company, error) {
	row := q.db.QueryRowContext(ctx, addCompany,
		arg.Name,
		arg.Addr,
		arg.LocationLat,
		arg.LocationLng,
	)
	var i Company
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Addr,
		&i.LocationLat,
		&i.LocationLng,
	)
	return i, err
}
