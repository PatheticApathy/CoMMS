// main for starting user api server
package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/joho/godotenv"

	_ "modernc.org/sqlite"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("No .env file found LOL: %e", err)
	}

	port := os.Getenv("USER_PORT")
	if port == "" {
		log.Fatal("No port set in environment variable")
	}

	db_path := os.Getenv("USERDB")
	if db_path == "" {
		log.Fatal("No database path set in environment variable")
	}

	db, err := sql.Open("sqlite", db_path)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	env := handler.NewEnv(db)
	http.Handle("/", env.Handler())

	log.Printf("Server is running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
