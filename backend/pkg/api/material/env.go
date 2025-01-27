// materialhandlers contians handlers for logging and adding materials to a paticular jobsite
package material

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
	mux.Handle("/material/", http.StripPrefix("/material", e.materialHandlers()))
	mux.Handle("/mlogs/", http.StripPrefix("/mlogs", e.materialLogHandlers()))
	mux.Handle("/sites/", http.StripPrefix("/sites", e.jobSiteHandlers()))
	mux.Handle("/checkout/", http.StripPrefix("/checkout", e.checkoutHandlers()))
	mux.Handle("/user/", http.StripPrefix("/user", e.userHandlers()))
	return mux
}

func (e *Env) materialHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /search", e.getMaterialHandler)
	mux.HandleFunc("POST /add", e.postMaterialHandler)
	mux.HandleFunc("GET /all", e.getAllMaterial)
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

func (e *Env) checkoutHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("Get /all", e.getAllCheckoutLogs)
	mux.HandleFunc("POST /out", e.postCheckout)
	mux.HandleFunc("PUT /in", e.putCheckin)
	return mux
}

func (e *Env) userHandlers() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("Get /all", e.getAllUsers)
	mux.HandleFunc("GET /{id}", e.getUser)
	mux.HandleFunc("POST /add", e.postAddUser)
	return mux
}
