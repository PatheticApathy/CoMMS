// This program populates the jobsite database with a given csv
package main

import (
	"context"
	"database/sql"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
	_ "modernc.org/sqlite"
)

func main() {
	ctxt := context.Background()

	// connect to db
	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	queries := userdb.New(db)

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

		jobsite := userdb.AddJobSiteParams{
			Name: row[0],
			Addr: sql.NullString{
				String: row[1],
				Valid:  true,
			},
			LocationLat: sql.NullFloat64{
				Float64: func() float64 {
					val, err := strconv.ParseFloat(row[2], 64)
					if err != nil {
						log.Fatal(err)
					}
					return val
				}(),
				Valid: true,
			},
			LocationLng: sql.NullFloat64{
				Float64: func() float64 {
					val, err := strconv.ParseFloat(row[3], 64)
					if err != nil {
						log.Fatal(err)
					}
					return val
				}(),
				Valid: true,
			},
			CompanyID: sql.NullInt64{
				Int64: func() int64 {
					val, err := strconv.ParseInt(row[4], 10, 64)
					if err != nil {
						log.Fatal(err)
					}
					return val
				}(),
				Valid: true,
			},
		}

		jobsite_row, err := queries.AddJobSite(ctxt, jobsite)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%v added\n", jobsite_row)
	}
}
