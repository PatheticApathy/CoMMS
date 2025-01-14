package auth

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
	"github.com/PatheticApathy/CoMMS/pkg/database/user_db"

	"fmt"
	"log"
)

//go:embed Userdb/migrations/*.sql
var ddl string

// Hashing function
func hash(input string) string {
	hasher := sha256.New()
	hasher.Write([]byte(input))
	return hex.EncodeToString(hasher.Sum(nil))
}

// takes a username and pass and checks the password against the database to verify the account.
func checkUserAndPass(queries *user_db.Queries, username, password string) {
	hash := queries.GetUserAndPass(username)
	hashedpass := hash(password)
	if hashedpass == hash {
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

	queries.GetUserAndPass()
}
