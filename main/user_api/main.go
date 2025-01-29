package main

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/PatheticApathy/CoMMS/docs/users"
	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	httpSwagger "github.com/swaggo/http-swagger" // http-swagger middleware
	_ "modernc.org/sqlite"
)

//	@title			User API
//	@version		1.0
//	@description	This is the api for dealing with users
//	@termsOfService	http://swagger.io/terms/

//	@contact.name	Comms group
//	@contact.url	http://github.com/PatheticApathy/CoMMS

//	@host		localhost:8080
//	@BasePath	/

// @externalDocs.description	OpenAPI
// @externalDocs.url			https://swagger.io/resources/open-api/
func main() {

	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	env := handler.NewEnv(db)
	http.Handle("/", env.Handler())
	http.Handle("/swagger/", httpSwagger.Handler())
	http.HandleFunc("/{$}", func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, "/swagger", http.StatusPermanentRedirect)
	})

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)

}
