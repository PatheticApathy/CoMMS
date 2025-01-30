// main for starting user api server
package main

import (
	"database/sql"
	"log"
	"net"
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

	// goes to osm if not set in .env
	nhost, nport, err := net.SplitHostPort(os.Getenv("NOMINATIM_HOST"))
	if err != nil {
		log.Println("WARNING: Nominatim api host not set or invalid syntax, defaulting to osm website")
		nhost = "https://nominatim.openstreetmap.org"
		nport = ""
	}
	nominatim := nhost + nport

	// prints warning if not set
	mhost, mport, err := net.SplitHostPort(os.Getenv("MATERIAL_HOST"))
	if err != nil {
		log.Printf("Warning: material api host not set: %e", err)
	}
	material := mhost + mport

	secret := os.Getenv("SECRETKEY")
	if secret == "" {
		log.Fatal("No secret set in environment variable")
	}
	if len([]byte(secret)) != 16 {
		log.Fatal("Error: Invalid secret length(must be 16 charcaters)")
	}

	_, port, err := net.SplitHostPort(os.Getenv("USER_HOST"))
	if err != nil {
		log.Fatal("No port for server set in environment variable or invalid syntax")
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

	env := handler.NewEnv(db, secret, material, nominatim)
	http.Handle("/", env.Handler())

	log.Printf("Server is running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
