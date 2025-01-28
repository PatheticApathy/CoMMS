package auth

import (

	// Imported for hashing
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"net/http"

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

	cookie := http.Cookie{
		Name:     "Login Cookie",
		Value:    username,
		Path:     "/",
		MaxAge:   3600,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
	}

	realhash, err := queries.GetUserAndPass(ctxt, username)
	if err != nil {
		log.Fatal(err)
	}
	hashedpass := hash(password)
	if hashedpass == realhash {
		//fmt.Println("Valid")
		http.SetCookie(w, &cookie)
	} else {
		fmt.Println("Invalid")
	}
}
