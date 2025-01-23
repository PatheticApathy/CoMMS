package materialhandlers

// TODO: Add material logging when user adds a material and when they change quantity of material
// TODO: Add get all materials route
import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	material_db "github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
)

// getMaterialHandler is a handler that returns materials based on given parameters godoc
// @Summary fetches material based on given  query parameters
// @Description Can get material using it's id, quantity and unit, type, or job site
// @Tags material
// @Produce json
// @Param id query int false "id of material"
// @Param quantity query int false "quantity of material, must be combined with unit"
// @Param unit query string false "unit of the quantity, must be combined with quantity"
// @Param type query string false "type of material"
// @Param site query int false "site id of which material belongs to"
// @Success 200 {array} material_db.Material "material"
// @Failure 400  {string} "bad request"
// @Failure 500  {string} "Internal Server Error"
// @Router /material/search [get]
func (e *Env) getMaterialHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	// has param id
	if query.Has("id") {
		//material_id, err := strconv.Atoi(query.Get("id"))
		//if err != nil {
		//	log.Printf("Material id is invalid, reason %e", err)
		//	http.Error(w, "invalid material id", http.StatusBadRequest)
		//}

		//materials, err := e.Queries.GetMaterialLogsByID(r.Context(), int64(material_id))
		//if err != nil {
		//	log.Printf("Material id is invalid, reason %e", err)
		//	http.Error(w, "invalid material id", http.StatusBadRequest)
		//}

		http.Error(w, "Not implemented yet", http.StatusInternalServerError)
		// json.NewEncoder(w).Encode(&materials)
		return
	}

	// has param quantity and unit
	if query.Has("quantity") && r.URL.Query().Has("unit") {

		quantity, err := strconv.Atoi(query.Get("quantity"))
		if err != nil {
			log.Printf("Quantity is invalid, reason %e", err)
			http.Error(w, "invalid quantity", http.StatusBadRequest)
			return
		}

		args := material_db.GetMaterialsByQuantityParams{
			Quantity: int64(quantity),
			Unit:     query.Get("unit"),
		}

		materials, err := e.Queries.GetMaterialsByQuantity(r.Context(), args)
		if err != nil {
			log.Printf("Quantity or unit is invalid, reason %e", err)
			http.Error(w, "invalid quantity or unit", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not create json: %e", err)
			http.Error(w, "invalid quantity or unit", http.StatusInternalServerError)
			return
		}
	}

	// has param site
	if query.Has("site") {
		site, err := strconv.Atoi(query.Get("site"))
		if err != nil {
			log.Printf("Invalid site id, reason %e", err)
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		args := sql.NullInt64{
			Int64: int64(site),
			Valid: true,
		}

		materials, err := e.Queries.GetMaterialsBySite(r.Context(), args)
		if err != nil {
			log.Printf("Invalid site id, reason %e", err)
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not create json: %e", err)
			http.Error(w, "Error creating json", http.StatusInternalServerError)
			return
		}
	}

	// has param type
	if r.URL.Query().Has("type") {

		args := sql.NullString{
			String: query.Get("type"),
			Valid:  true,
		}

		materials, err := e.Queries.GetMaterialsByType(r.Context(), args)
		if err != nil {
			log.Printf("Invalid type, reason %e", err)
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not create json: %e", err)
			http.Error(w, "Error creating json", http.StatusInternalServerError)
			return
		}
	}

	// has no valid params
	log.Println("Invalid query")
	http.Error(w, "invalid query", http.StatusBadRequest)
}

// postMaterialHandler is a handler that adds materials to the database godoc
// @Summary post materials to database
// @Description Adds materials to the database using valid json structure
// @Tags material
// @Produce json
// @Param material body material_db.AddMaterialParams true "Format of add material request"
// @Success 200 {object} material_db.Material "material"
// @Failure 400  {string} "bad request"
// @Failure 500  {string} "Internal Server Error"
// @Router /material/add [post]
func (e *Env) postMaterialHandler(w http.ResponseWriter, r *http.Request) {
	var material material_db.AddMaterialParams

	if err := json.NewDecoder(r.Body).Decode(&material); err != nil {
		log.Printf("Could not parse json obj: %e", err)
		http.Error(w, "Error parsing json", http.StatusBadRequest)
		return
	}

	ret, err := e.Queries.AddMaterial(r.Context(), material)
	if err != nil {
		log.Printf(`Invalid Material insertion, reason %e`, err)
		http.Error(w, `Could not add material`, http.StatusBadRequest)
		return
	}

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Printf("Could not create json obj: %e", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}

// changeMaterialQuantity is a handler that changes the quantity of the material and also the status if certain conditions are met godoc
// @Summary adjust quantity based on the requested amount
// @Description changes the quantity of the given material using it's id
// @Tags material
// @Produce json
// @Param material body material_db.ChangeQuantityParams true "Format of changing material quantity"
// @Success 200 {object} material_db.Material "material"
// @Failure 400  {string} "bad request"
// @Failure 500  {string} "Internal Server Error"
// @Router /material/change [post]
func (e *Env) changeMaterialQuantity(w http.ResponseWriter, r *http.Request) {
	var args material_db.ChangeQuantityParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("Could not parse json obj: %e", err)
		http.Error(w, "Error parsing json", http.StatusBadRequest)
		return
	}

	material, err := e.Queries.ChangeQuantity(r.Context(), args)
	if err != nil {
		log.Printf(`Invalid Material change, reason %e`, err)
		http.Error(w, `Could not change material quantity`, http.StatusBadRequest)
		return
	}

	if material.Quantity < 30 && material.Quantity != 0 {
		log.Printf(`Low material count for %v, changing status`, material.Name)

		mat, err := e.Queries.ChangeStatus(r.Context(), material_db.ChangeStatusParams{Status: "Low Stock", ID: material.ID})
		if err != nil {
			log.Printf(`Could not change status, reason %e`, err)
			http.Error(w, `Failed status change`, http.StatusInternalServerError)
			return
		}
		material.Status = mat.Status
	}

	if material.Quantity <= 0 {
		log.Printf(`Out of material %v, changing status`, material.Name)

		mat, err := e.Queries.ChangeStatus(r.Context(), material_db.ChangeStatusParams{Status: "Out of Stock", ID: material.ID})
		if err != nil {
			log.Printf(`Could not change status, reason %e`, err)
			http.Error(w, `Failed status change`, http.StatusInternalServerError)
			return
		}
		material.Status = mat.Status
	}

	if err := json.NewEncoder(w).Encode(&material); err != nil {
		log.Printf("Could not create json obj: %e", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}
