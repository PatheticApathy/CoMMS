// materialhandlers contians handlers for logging and adding materials to a paticular jobsite
package materialhandlers

import (
	"database/sql"
	"net/http"

	material_db "github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
)

type Env struct {
	Queries material_db.Queries
}

func NewEnv(db *sql.DB) Env {
	return Env{
		Queries: *material_db.New(db),
	}
}

func (e *Env) Handlers() http.Handler {
	mux := http.NewServeMux()
	mux.Handle("/material", e.materialHandlers())
	mux.Handle("/mlogs", e.materialLogHandlers())
	mux.Handle("/sites", e.jobSiteHandlers())
	return mux
}

func (e *Env) materialHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /search", e.getMaterialHandler)
	mux.HandleFunc("POST /add", e.postMaterialHandler)
	mux.HandleFunc("PUT /change", e.changeMaterialQuantity)
	return mux
}

func (e *Env) materialLogHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /search", e.getMaterialLogsHandler)
	mux.HandleFunc("GET /all", e.getAllMaterialLogsHandler)
	mux.HandleFunc("POST /add", e.postMaterialHandler)
	mux.HandleFunc("PUT /note", e.changeMaterialLogNoteHandler)
	return mux
}

func (e *Env) jobSiteHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /search", e.getMaterialHandler)
	mux.HandleFunc("GET /all", e.getAllMaterialLogsHandler)
	mux.HandleFunc("POST /add", e.addJobSiteHandler)
	return mux
}
