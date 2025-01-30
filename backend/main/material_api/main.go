package main

import (
	"database/sql"
	"log"
	"net"
	"net/http"
	"os"

	_ "github.com/PatheticApathy/CoMMS/docs/material"
	"github.com/PatheticApathy/CoMMS/pkg/api/material"
	"github.com/PatheticApathy/CoMMS/pkg/middleware" // http-swagger middleware
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger" // http-swagger middleware
	_ "modernc.org/sqlite"
)

//	@title			Material Tracker API
//	@version		1.0
//	@description	This is the material tracking application's api for dealing with the materials
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	Comms group
//	@contact.url	http://github.com/PatheticApathy/CoMMS

//	@host		localhost:8080
//	@BasePath	/

// @externalDocs.description	OpenAPI
// @externalDocs.url			https://swagger.io/resources/open-api/
func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("No .env file found LOL: %e", err)
	}

	_, port, err := net.SplitHostPort(os.Getenv("MATERIAL_HOST"))
	if err != nil {
		log.Fatal("No port set in environment variable for material api host")
	}

	db_path := os.Getenv("MATERIALDB")
	if db_path == "" {
		log.Fatal("No database path set in environment variable")
	}

	db, err := sql.Open("sqlite", db_path)
	if err != nil {
		log.Fatal(err)
	}

	env := material.NewEnv(db)
	router := http.NewServeMux()
	router.Handle("/", env.Handlers())
	router.Handle("/swagger/", httpSwagger.Handler())
	router.HandleFunc("/{$}", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger", http.StatusPermanentRedirect)
	})

	serv := http.Server{
		Addr:    ":" + port,
		Handler: middleware.Middlewares(middleware.Json, middleware.Logger)(router),
	}

	defer serv.Close()

	log.Printf("Running on port %s", port)
	log.Fatal(serv.ListenAndServe())
}
