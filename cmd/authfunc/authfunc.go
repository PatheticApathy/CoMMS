package main

import (

	// Imported for hashing
	"context"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"fmt"
	"log"

	_ "modernc.org/sqlite"

	// Importing for verification
	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
)

// Hashing function
func hash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}

// takes a username and pass and checks the password against the database to verify the account.
func checkUserAndPass(queries *user_db.Queries, ctxt context.Context, username, password string) {
	realhash, err := queries.GetUserAndPass(ctxt, username)
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
	ctxt := context.Background()

	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	queries := user_db.New(db)

	checkUserAndPass(queries, ctxt, "tempUser", "tempPass")
}
