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
			Username:  row[0],
			Password:  row[1],
			Firstname: row[2],
			Lastname:  row[3],
			Company:   row[4],
			Site:      row[5],
			Role:      row[6],
			Email:     row[7],
			Phone:     row[8],
		}

		user_row, err := queries.AddUser(ctxt, user)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%v added\n", user_row)
	}
}
