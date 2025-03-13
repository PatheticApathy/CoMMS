package handler

import (
	"database/sql"
	"net/http"

	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
)

type Env struct {
	Queries *userdb.Queries
	Secret  string
}

func NewEnv(db *sql.DB, secret string) Env {
	return Env{
		Queries: userdb.New(db),
		Secret:  secret,
	}
}

func (e *Env) Handlers() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/sites/", http.StripPrefix("/sites", e.jobSiteHandlers()))
	mux.Handle("/user/", http.StripPrefix("/user", e.userHandlers()))
	mux.Handle("/company/", http.StripPrefix("/company", e.companyHandlers()))
	return mux
}

func (e *Env) userHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /create", e.createUser)
	mux.HandleFunc("POST /signup", e.SignUp)
	mux.HandleFunc("PUT /update", e.updateUser)
	mux.HandleFunc("DELETE /delete", e.deleteUser)
	mux.HandleFunc("GET /all", e.getUsers)
	mux.HandleFunc("GET /search", e.getUser)
	mux.HandleFunc("GET /username", e.getUserName)
	mux.HandleFunc("POST /login", e.authenticate)
	mux.HandleFunc("POST /logout", e.loggout)
	mux.HandleFunc("POST /decrypt", e.DecryptHanlder)
	return mux
}

func (e *Env) companyHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("POST /create", e.createCompany)
	return mux
}

func (e *Env) jobSiteHandlers() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /search", e.getJobSiteHandler)
	mux.HandleFunc("GET /all", e.getAllJobSitesHandler)
	mux.HandleFunc("POST /add", e.addJobSiteHandler)
	return mux
}
