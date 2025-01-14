package main

import (

	// Imported for hashing
	"crypto/sha256"
	"encoding/hex"

	// Imported for testing
	"context"
	"database/sql"
	_ "embed"

	_ "github.com/mattn/go-sqlite3"

	// Importing for verification
	user_db "github.com/PatheticApathy/CoMMS/pkg/database"

	"fmt"
	"log"
)

//go:embed Userdb/migrations/*
var ddl string

// Hashing function
func hash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}

// takes a username and pass and checks the password against the database to verify the account.
func checkUserAndPass(queries *user_db.Queries, ctx context.Context, username, password string) {
	realhash, err := queries.GetUserAndPass(ctx, username)
	if err != nil {
		log.Fatal(err)
	}
	hashedpass := hash(password)
	if hashedpass == realhash {
		fmt.Println("Valid")
	} else {
		fmt.Println("Invalid")
	}
}

func main() {
	db, err := sql.Open("sqlite3", "./foo.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	ctx := context.Background()
	if _, err := db.ExecContext(ctx, ddl); err != nil {
		log.Fatal(err)
	}

	queries := user_db.New(db)

	checkUserAndPass(queries, ctx, "tempUser", "tempPass")
}
