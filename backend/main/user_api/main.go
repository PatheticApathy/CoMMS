// main for starting user api server
package main

import (
	"database/sql"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	_ "github.com/PatheticApathy/CoMMS/docs/users"
	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/PatheticApathy/CoMMS/pkg/middleware"
	"github.com/joho/godotenv"
	httpSwagger "github.com/swaggo/http-swagger"

	_ "modernc.org/sqlite"
)

//	@title			User API
//	@version		1.0
//	@description	This is the api for dealing with users
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	Comms group
//	@contact.url	http://github.com/PatheticApathy/CoMMS

// @host						localhost:8082
// @BasePath					/
//
// @securityDefinitions.apikey	identity
// @in							header
// @name						Authorization
// @tokenUrl					localhost:8082/user/login
// @description				gives read and write access to api
//
// @externalDocs.description	OpenAPI
// @externalDocs.url			https://swagger.io/resources/open-api/
func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("No .env file found LOL: %e", err)
	}

	// goes to osm if not set in .env
	nom_url := os.Getenv("NOMINATIM_HOST")
	nominatim_host, err := url.Parse(nom_url)
	if err != nil || nom_url == "" {
		log.Println("WARNING: Nominatim api host not set or invalid syntax, defaulting to osm website")
		nominatim_host, _ = url.Parse("https://nominatim.openstreetmap.org")
	}
	nom_proxy := httputil.NewSingleHostReverseProxy(nominatim_host)

	// goes to osm if not set in .env
	osm_url := os.Getenv("MAP_HOST")
	osm_host, err := url.Parse(osm_url)
	if err != nil || nom_url == "" {
		log.Println("WARNING: OSM api host not set or invalid syntax, defaulting to osm website")
	}
	osm_proxy := httputil.NewSingleHostReverseProxy(osm_host)

	// prints warning if not set
	mat_host, err := url.Parse(os.Getenv("MATERIAL_HOST"))
	if err != nil {
		log.Printf("Warning: material api host not set: %e", err)
	}
	mat_proxy := httputil.NewSingleHostReverseProxy(mat_host)

	secret := os.Getenv("SECRETKEY")
	if secret == "" {
		log.Fatal("No secret set in environment variable")
	}
	if len([]byte(secret)) != 32 {
		log.Fatal("Error: Invalid secret length(must be 32 charcaters)")
	}

	url, err := url.Parse(os.Getenv("USER_HOST"))
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

	env := handler.NewEnv(db, secret)
	router := http.NewServeMux()
	router.Handle("/", env.Handler())
	router.Handle("/material/", http.StripPrefix("/material", mat_proxy))
	router.Handle("/geo/", http.StripPrefix("/geo", nom_proxy))
	router.Handle("/map/", http.StripPrefix("/map", osm_proxy))
	router.Handle("/swagger/", httpSwagger.Handler())
	router.HandleFunc("/{$}", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger", http.StatusPermanentRedirect)
	})

	serv := http.Server{
		Addr:    ":" + url.Port(),
		Handler: middleware.Middlewares(middleware.Json, middleware.Logger)(router),
	}

	log.Printf("Server is running on on %s:%s", url.Hostname(), serv.Addr)
	log.Fatal(serv.ListenAndServe())
}
