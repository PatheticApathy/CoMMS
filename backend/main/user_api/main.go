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

// if nominatim host not set in .env, default to osm
func getNomAddr() string {
	nominatim_host, nominatim_port := os.Getenv("NOMINATIM_HOST"), os.Getenv("NOMINATIM_HOST")
	if nominatim_host == "" || nominatim_port == "" {
		log.Printf("WARNING: Nominatim api host or port not set, defaulting to website. Using default")
		return "https://nominatim.openstreetmap.org"
	} else {
		return nominatim_host + nominatim_port
	}
}

// get material api address. If not set, skip
func getMatAddr() string {
	host, port := os.Getenv("MATERIAL_HOST"), os.Getenv("MATERIAL_PORT")
	if host == "" || port == "" {
		log.Printf("WARNING: Material api host or port not set, skipping")
		return ""
	} else {
		return host + port
	}
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("No .env file found LOL: %e", err)
	}

	// goes to osm if not set in .env
	nominatim := getNomAddr()

	// prints warning if not set
	material := getMatAddr()

	secret := os.Getenv("SECRETKEY")
	if secret == "" {
		log.Fatal("No secret set in environment variable")
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

	env := handler.NewEnv(db, secret, material, nominatim)
	http.Handle("/", env.Handler())

	log.Printf("Server is running on port %s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
