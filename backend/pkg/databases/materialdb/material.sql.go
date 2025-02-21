// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: material.sql

package materialdb

import (
	"context"
	"database/sql"
)

const addMaterial = `-- name: AddMaterial :one
INSERT INTO Materials(name,type,quantity,unit,status,location_lat,location_lng,job_site)
VALUES (?,?,?,?,?,?,?,?)
RETURNING id, name, type, quantity, unit, status, location_lat, location_lng, last_checked_out, job_site
`

type AddMaterialParams struct {
	Name        sql.NullString  `json:"name"`
	Type        sql.NullString  `json:"type"`
	Quantity    int64           `json:"quantity"`
	Unit        string          `json:"unit"`
	Status      string          `json:"status"`
	LocationLat sql.NullFloat64 `json:"location_lat"`
	LocationLng sql.NullFloat64 `json:"location_lng"`
	JobSite     sql.NullInt64   `json:"job_site"`
}

func (q *Queries) AddMaterial(ctx context.Context, arg AddMaterialParams) (Material, error) {
	row := q.db.QueryRowContext(ctx, addMaterial,
		arg.Name,
		arg.Type,
		arg.Quantity,
		arg.Unit,
		arg.Status,
		arg.LocationLat,
		arg.LocationLng,
		arg.JobSite,
	)
	var i Material
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Type,
		&i.Quantity,
		&i.Unit,
		&i.Status,
		&i.LocationLat,
		&i.LocationLng,
		&i.LastCheckedOut,
		&i.JobSite,
	)
	return i, err
}

const changeQuantity = `-- name: ChangeQuantity :one
UPDATE Materials
  SET quantity = ?
  WHERE  id = ?
RETURNING id, name, type, quantity, unit, status, location_lat, location_lng, last_checked_out, job_site
`

type ChangeQuantityParams struct {
	Quantity int64 `json:"quantity"`
	ID       int64 `json:"id"`
}

func (q *Queries) ChangeQuantity(ctx context.Context, arg ChangeQuantityParams) (Material, error) {
	row := q.db.QueryRowContext(ctx, changeQuantity, arg.Quantity, arg.ID)
	var i Material
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Type,
		&i.Quantity,
		&i.Unit,
		&i.Status,
		&i.LocationLat,
		&i.LocationLng,
		&i.LastCheckedOut,
		&i.JobSite,
	)
	return i, err
}

const changeStatus = `-- name: ChangeStatus :one
UPDATE Materials
  SET status = ?
  WHERE  id = ?
RETURNING id, name, type, quantity, unit, status, location_lat, location_lng, last_checked_out, job_site
`

type ChangeStatusParams struct {
	Status string `json:"status"`
	ID     int64  `json:"id"`
}

func (q *Queries) ChangeStatus(ctx context.Context, arg ChangeStatusParams) (Material, error) {
	row := q.db.QueryRowContext(ctx, changeStatus, arg.Status, arg.ID)
	var i Material
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Type,
		&i.Quantity,
		&i.Unit,
		&i.Status,
		&i.LocationLat,
		&i.LocationLng,
		&i.LastCheckedOut,
		&i.JobSite,
	)
	return i, err
}

const deleteMaterial = `-- name: DeleteMaterial :one
DELETE FROM Materials
WHERE id = ?
RETURNING id, name, type, quantity, unit, status, location_lat, location_lng, last_checked_out, job_site
`

func (q *Queries) DeleteMaterial(ctx context.Context, id int64) (Material, error) {
	row := q.db.QueryRowContext(ctx, deleteMaterial, id)
	var i Material
	err := row.Scan(
		&i.ID,
		&i.Name,
		&i.Type,
		&i.Quantity,
		&i.Unit,
		&i.Status,
		&i.LocationLat,
		&i.LocationLng,
		&i.LastCheckedOut,
		&i.JobSite,
	)
	return i, err
}

const getAllMaterials = `-- name: GetAllMaterials :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out FROM Materials
`

type GetAllMaterialsRow struct {
	ID             int64           `json:"id"`
	Name           sql.NullString  `json:"name"`
	Type           sql.NullString  `json:"type"`
	Quantity       int64           `json:"quantity"`
	Unit           string          `json:"unit"`
	Status         string          `json:"status"`
	LocationLat    sql.NullFloat64 `json:"location_lat"`
	LocationLng    sql.NullFloat64 `json:"location_lng"`
	JobSite        sql.NullInt64   `json:"job_site"`
	LastCheckedOut interface{}     `json:"last_checked_out"`
}

func (q *Queries) GetAllMaterials(ctx context.Context) ([]GetAllMaterialsRow, error) {
	rows, err := q.db.QueryContext(ctx, getAllMaterials)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetAllMaterialsRow
	for rows.Next() {
		var i GetAllMaterialsRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Type,
			&i.Quantity,
			&i.Unit,
			&i.Status,
			&i.LocationLat,
			&i.LocationLng,
			&i.JobSite,
			&i.LastCheckedOut,
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

const getMaterialsByID = `-- name: GetMaterialsByID :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out FROM Materials WHERE id=?
`

type GetMaterialsByIDRow struct {
	ID             int64           `json:"id"`
	Name           sql.NullString  `json:"name"`
	Type           sql.NullString  `json:"type"`
	Quantity       int64           `json:"quantity"`
	Unit           string          `json:"unit"`
	Status         string          `json:"status"`
	LocationLat    sql.NullFloat64 `json:"location_lat"`
	LocationLng    sql.NullFloat64 `json:"location_lng"`
	JobSite        sql.NullInt64   `json:"job_site"`
	LastCheckedOut interface{}     `json:"last_checked_out"`
}

func (q *Queries) GetMaterialsByID(ctx context.Context, id int64) ([]GetMaterialsByIDRow, error) {
	rows, err := q.db.QueryContext(ctx, getMaterialsByID, id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMaterialsByIDRow
	for rows.Next() {
		var i GetMaterialsByIDRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Type,
			&i.Quantity,
			&i.Unit,
			&i.Status,
			&i.LocationLat,
			&i.LocationLng,
			&i.JobSite,
			&i.LastCheckedOut,
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

const getMaterialsByQuantity = `-- name: GetMaterialsByQuantity :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out
FROM Materials 
WHERE quantity=? AND unit=?
`

type GetMaterialsByQuantityParams struct {
	Quantity int64  `json:"quantity"`
	Unit     string `json:"unit"`
}

type GetMaterialsByQuantityRow struct {
	ID             int64           `json:"id"`
	Name           sql.NullString  `json:"name"`
	Type           sql.NullString  `json:"type"`
	Quantity       int64           `json:"quantity"`
	Unit           string          `json:"unit"`
	Status         string          `json:"status"`
	LocationLat    sql.NullFloat64 `json:"location_lat"`
	LocationLng    sql.NullFloat64 `json:"location_lng"`
	JobSite        sql.NullInt64   `json:"job_site"`
	LastCheckedOut interface{}     `json:"last_checked_out"`
}

func (q *Queries) GetMaterialsByQuantity(ctx context.Context, arg GetMaterialsByQuantityParams) ([]GetMaterialsByQuantityRow, error) {
	rows, err := q.db.QueryContext(ctx, getMaterialsByQuantity, arg.Quantity, arg.Unit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMaterialsByQuantityRow
	for rows.Next() {
		var i GetMaterialsByQuantityRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Type,
			&i.Quantity,
			&i.Unit,
			&i.Status,
			&i.LocationLat,
			&i.LocationLng,
			&i.JobSite,
			&i.LastCheckedOut,
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

const getMaterialsBySite = `-- name: GetMaterialsBySite :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site, last_checked_out FROM Materials WHERE job_site=?
`

type GetMaterialsBySiteRow struct {
	ID             int64           `json:"id"`
	Name           sql.NullString  `json:"name"`
	Type           sql.NullString  `json:"type"`
	Quantity       int64           `json:"quantity"`
	Unit           string          `json:"unit"`
	Status         string          `json:"status"`
	LocationLat    sql.NullFloat64 `json:"location_lat"`
	LocationLng    sql.NullFloat64 `json:"location_lng"`
	JobSite        sql.NullInt64   `json:"job_site"`
	LastCheckedOut interface{}     `json:"last_checked_out"`
}

func (q *Queries) GetMaterialsBySite(ctx context.Context, jobSite sql.NullInt64) ([]GetMaterialsBySiteRow, error) {
	rows, err := q.db.QueryContext(ctx, getMaterialsBySite, jobSite)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMaterialsBySiteRow
	for rows.Next() {
		var i GetMaterialsBySiteRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Type,
			&i.Quantity,
			&i.Unit,
			&i.Status,
			&i.LocationLat,
			&i.LocationLng,
			&i.JobSite,
			&i.LastCheckedOut,
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

const getMaterialsByType = `-- name: GetMaterialsByType :many
SELECT id, name, type, quantity, unit, status, location_lat, location_lng, job_site , last_checked_out FROM Materials WHERE type=?
`

type GetMaterialsByTypeRow struct {
	ID             int64           `json:"id"`
	Name           sql.NullString  `json:"name"`
	Type           sql.NullString  `json:"type"`
	Quantity       int64           `json:"quantity"`
	Unit           string          `json:"unit"`
	Status         string          `json:"status"`
	LocationLat    sql.NullFloat64 `json:"location_lat"`
	LocationLng    sql.NullFloat64 `json:"location_lng"`
	JobSite        sql.NullInt64   `json:"job_site"`
	LastCheckedOut interface{}     `json:"last_checked_out"`
}

func (q *Queries) GetMaterialsByType(ctx context.Context, type_ sql.NullString) ([]GetMaterialsByTypeRow, error) {
	rows, err := q.db.QueryContext(ctx, getMaterialsByType, type_)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var items []GetMaterialsByTypeRow
	for rows.Next() {
		var i GetMaterialsByTypeRow
		if err := rows.Scan(
			&i.ID,
			&i.Name,
			&i.Type,
			&i.Quantity,
			&i.Unit,
			&i.Status,
			&i.LocationLat,
			&i.LocationLng,
			&i.JobSite,
			&i.LastCheckedOut,
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
