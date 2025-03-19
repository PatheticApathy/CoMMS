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
INSERT INTO Companies(name, addr, location_lat, location_lng) VALUES (?, ?, ?, ?) RETURNING id, name, addr, location_lat, location_lng
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

const getAllCompanies = `-- name: GetAllCompanies :many
SELECT id, name, addr, location_lat, location_lng FROM Companies
`

func (q *Queries) GetAllCompanies(ctx context.Context) ([]Company, error) {
	rows, err := q.db.QueryContext(ctx, getAllCompanies)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []Company
	for rows.Next() {
		var i Company
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Addr,
			&i.LocationLat,
			&i.LocationLng,
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

const getCompany = `-- name: GetCompany :one
SELECT id, name, addr, location_lat, location_lng FROM Companies WHERE id = ?
`

func (q *Queries) GetCompany(ctx context.Context, id int64) (Company, error) {
	row := q.db.QueryRowContext(ctx, getCompany, id)
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
