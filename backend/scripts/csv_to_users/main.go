// This program populates the user database with a given csv
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

	auth "github.com/PatheticApathy/CoMMS/pkg/auth"
	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
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

	queries := user_db.New(db)

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

		user := user_db.AddUserParams{
			Username: row[0],
			Password: auth.Hash(row[1]),
			Firstname: sql.NullString{
				String: row[2],
				Valid:  true,
			},
			Lastname: sql.NullString{
				String: row[3],
				Valid:  true,
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
			JobsiteID: sql.NullInt64{
				Int64: func() int64 {
					val, err := strconv.ParseInt(row[5], 10, 64)
					if err != nil {
						log.Fatal(err)
					}
					return val
				}(),
				Valid: true,
			},
			Role: sql.NullString{
				String: row[6],
				Valid:  true,
			},
			Email: row[7],
			Phone: row[8],
			Profilepicture: sql.NullString{
				String: row[9],
				Valid:  true,
			},
		}

		user_row, err := queries.AddUser(ctxt, user)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%v added\n", user_row)
	}
}
