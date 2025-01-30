// main for starting user api server
package main

import (
	"database/sql"
	"fmt"
	"net/http"

	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"

	_ "modernc.org/sqlite"
)

func main() {
	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	env := handler.NewEnv(db)
	http.Handle("/", env.Handler())

	fmt.Println("Server is running on port 8080")
	http.ListenAndServe(":8080", nil)
}
