// This program populates the materail database with a given csv
package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"os"
	"strconv"

	material_db "github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
	_ "modernc.org/sqlite"
)

func main() {
	ctxt := context.Background()

	// connect to db
	db, err := sql.Open("sqlite", "./databases/Materialdb/materials.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	material_queries := material_db.New(db)

	if len(os.Args) < 2 {
		fmt.Println("Please choose a file as an argument")
		return
	}

	// open file for reading as csv
	file, err := os.Open(os.Args[1])
	if err != nil {
		fmt.Println(err)
	}
	rows := csv.NewReader(file)

	// first row is ignored
	_, err = rows.Read()

	if err == io.EOF {
		return
	}

	if err != nil {
		fmt.Println(err)
	}

	for {
		row, err := rows.Read()

		if err == io.EOF {
			break
		}

		if err != nil {
			fmt.Println(err)
		}

		quantity, err := strconv.Atoi(row[2])
		if err != nil {
			fmt.Println(err)
		}

		jobsite, err := strconv.Atoi(row[5])
		if err != nil {
			fmt.Println(err)
		}

		material := material_db.AddMaterialParams{
			Name: sql.NullString{
				String: row[0],
				Valid:  true,
			},
			Type: sql.NullString{
				String: row[1],
				Valid:  true,
			},
			Quantity: int64(quantity),
			Unit:     row[3],
			Status:   row[4],
			JobSite:  int64(jobsite),
			LocationLat: sql.NullFloat64{
				Valid: false,
			},
			LocationLng: sql.NullFloat64{
				Valid: false,
			},
		}

		material_queries.AddMaterial(ctxt, material)
		fmt.Printf("%v added\n", row)
	}
}
