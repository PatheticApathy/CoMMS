package materialhandlers

// TODO: Make checkout logs handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
)

// getMaterialLogsHandler gets material log based on given params godoc
// @Summary fetches material logs based on given query parameters
// @Description Can get material using it's id, or the material it relates to
// @Tags material logs
// @Produce json
// @Param id query int false "id of material log"
// @Param material query int false "id of material"
// @Success 200 {object} material_db.MaterialLog "material log"
// @Failure 400  {string} "bad request"
// @Failure 500  {string} "Internal Server Error"
// @Router /mlogs/search [get]
func (e *Env) getMaterialLogsHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query.Has("id") {

		id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf("Invalid material log id, reason %e", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		material_log, err := e.Queries.GetMaterialLogsByID(r.Context(), int64(id))
		if err != nil {
			log.Printf("Invalid material log id, reason %e", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&material_log); err != nil {
			log.Printf("could not encode to json, reason %e", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		return
	}
	if query.Has("material") {
		id, err := strconv.Atoi(query.Get("material"))
		if err != nil {
			log.Printf("Invalid material id, reason %e", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		material_log, err := e.Queries.GetMaterialLogsByMaterial(r.Context(), int64(id))
		if err != nil {
			log.Printf("Invalid material id, reason %e", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&material_log); err != nil {
			log.Printf("could not encode to json, reason %e", err)
			http.Error(w, "internal server error", http.StatusInternalServerError)
			return
		}
		return
	}
	log.Printf("No valid paramerters given")
	http.Error(w, "bad request", http.StatusBadRequest)
}

// getAllMaterialLogsHandler gets all material logs
// @Summary fetches all material logs
// @Description gets all material logs if they exist
// @Tags material logs
// @Produce json
// @Success 200 {array} material_db.MaterialLog "material logs"
// @Failure 500  {string} "Internal Server Error"
// @Router /mlogs/all [get]
func (e *Env) getAllMaterialLogsHandler(w http.ResponseWriter, r *http.Request) {
	logs, err := e.Queries.GetAllMaterialLogs(r.Context())
	if err != nil {
		log.Printf("No material logs, reason %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if err = json.NewEncoder(w).Encode(&logs); err != nil {
		log.Printf("could not encode to json, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}

// postMaterialLogsHandler adds material logs godoc
// @Summary post material log to database
// @Description Adds material log  to the database using valid json structure
// @Tags site
// @Accept json
// @Produce json
// @Param materiallog body material_db.AddMaterialLogsHandler true "Format of add material log request"
// @Success 200 {object} material_db.MaterialLog "material log"
// @Failure 400  {string} "bad request"
// @Failure 500  {string} "Internal Server Error"
// @Router /mlog/add [post]
func (e *Env) postMaterialLogsHandler(w http.ResponseWriter, r *http.Request) {
	var args materialdb.AddMaterialLogParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("could not decode to json, reason %e", err)
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	lg, err := e.Queries.AddMaterialLog(r.Context(), args)
	if err != nil {
		log.Printf("could add material log, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	if err = json.NewEncoder(w).Encode(&lg); err != nil {
		log.Printf("could not encode to json, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}

// changeMaterialLogNoteHandler changes material log note godoc
// @Summary post changes not on a existing material log
// @Description  changes the not field of a materiallog
// @Tags site
// @Accept json
// @Produce json
// @Param note_and-id body material_db.ChangeMaterialNoteParams true "Format of changing matterial note request"
// @Success 200 {object} material_db.MaterialLog "material log"
// @Failure 400  {string} "bad request"
// @Failure 500  {string} "Internal Server Error"
// @Router /mlog/note [post]
func (e *Env) changeMaterialLogNoteHandler(w http.ResponseWriter, r *http.Request) {
	var args materialdb.ChangeMaterialNoteParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("could not decode json, reason %e", err)
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	lg, err := e.Queries.ChangeMaterialNote(r.Context(), args)
	if err != nil {
		log.Printf("Could change note attached to material, reason %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if err = json.NewEncoder(w).Encode(&lg); err != nil {
		log.Printf("json error, reason %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
