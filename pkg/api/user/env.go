package handler

import (
	"database/sql"
	"net/http"

	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
)

type Env struct {
	Queries *user_db.Queries
}

func NewEnv(db *sql.DB) Env {
	return Env{
		Queries: user_db.New(db),
	}
}

func (e *Env) Handler() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /user/create", e.createUser)
	mux.HandleFunc("POST /user/signup", e.SignUp)
	mux.HandleFunc("PUT /user/update", e.updateUser)
	mux.HandleFunc("DELETE /user/delete", e.deleteUser)
	mux.HandleFunc("GET /user/all", e.getUsers)
	mux.HandleFunc("GET /user/search", e.getUser)
	return mux
}
