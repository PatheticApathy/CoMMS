package material

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	materialdb "github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
)

// getMaterialHandler is a handler that returns materials based on given parameters godoc
//
//	@Summary		fetches material based on given  query parameters
//	@Description	Can get material using its id, quantity and unit, type, or job site
//	@Tags			material
//	@Produce		json
//	@Param			id			query		int						false	"id of material"
//	@Param			quantity	query		int						false	"quantity of material, must be combined with unit"
//	@Param			unit		query		string					false	"unit of the quantity, must be combined with quantity"
//	@Param			type		query		string					false	"type of material"
//	@Param			site		query		int						false	"site id of which material belongs to"
//	@Success		200			{array}	materialdb.Material	"material"
//	@Failure		400			{string} string	"bad request"
//	@Failure		500			{string} string 	"Internal Server Error"
//	@Router			/material/search [get]
func (e *Env) getMaterialHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	// has param id
	if query.Has("id") {
		material_id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf("Material id is invalid, reason %s", err)
			http.Error(w, "invalid material id", http.StatusBadRequest)
			return
		}

		materials, err := e.Queries.GetMaterialsByID(r.Context(), int64(material_id))
		if err != nil {
			log.Printf("Material id is invalid, reason %s", err)
			http.Error(w, "invalid material id", http.StatusBadRequest)
			return
		}

		log.Printf("Material %d found", material_id)
		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not encode to json %s", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}
		return
	}

	// has param quantity and unit
	if query.Has("quantity") && r.URL.Query().Has("unit") {

		quantity, err := strconv.Atoi(query.Get("quantity"))
		if err != nil {
			log.Printf("Quantity is invalid, reason %s", err)
			http.Error(w, "invalid quantity", http.StatusBadRequest)
			return
		}
		unit := query.Get("unit")
		args := materialdb.GetMaterialsByQuantityParams{
			Quantity: int64(quantity),
			Unit:     unit,
		}

		materials, err := e.Queries.GetMaterialsByQuantity(r.Context(), args)
		if err != nil {
			log.Printf("Quantity or unit is invalid, reason %s", err)
			http.Error(w, "invalid quantity or unit", http.StatusBadRequest)
			return
		}

		log.Printf("Material(s) found with quantity %d%s", quantity, unit)
		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not create json: %s", err)
			http.Error(w, "invalid quantity or unit", http.StatusInternalServerError)
			return
		}
		return
	}

	// has param site
	if query.Has("site") {
		site, err := strconv.Atoi(query.Get("site"))
		if err != nil {
			log.Printf("Invalid site id, reason %s", err)
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		args := sql.NullInt64{
			Int64: int64(site),
			Valid: true,
		}

		materials, err := e.Queries.GetMaterialsBySite(r.Context(), args)
		if err != nil {
			log.Printf("Invalid site id, reason %s", err)
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		log.Printf("Material(s) at site %d", site)
		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not create json: %s", err)
			http.Error(w, "Error creating json", http.StatusInternalServerError)
			return
		}
		return
	}

	// has param type
	if query.Has("type") {

		typ := query.Get("type")
		args := sql.NullString{
			String: query.Get("type"),
			Valid:  true,
		}

		materials, err := e.Queries.GetMaterialsByType(r.Context(), args)
		if err != nil {
			log.Printf("Invalid type, reason %s", err)
			http.Error(w, "invalid id", http.StatusBadRequest)
			return
		}

		log.Printf("Found materials of type %s", typ)
		if err := json.NewEncoder(w).Encode(&materials); err != nil {
			log.Printf("Could not create json: %s", err)
			http.Error(w, "Error creating json", http.StatusInternalServerError)
			return
		}
		return
	}

	// has no valid params
	log.Println("Invalid query")
	http.Error(w, "invalid query", http.StatusBadRequest)
}

// getAllMaterial is a handler that gets material from the database godoc
//
//	@Summary		gets all materials from database
//	@Description	Gets all material form database
//	@Tags			material
//	@Produce		json
//	@Success		200	{array}	materialdb.Material	"material"
//	@Failure		500	{string} string	"Internal Server Error"
//	@Router			/material/all [get]
func (e *Env) getAllMaterial(w http.ResponseWriter, r *http.Request) {
	materials, err := e.Queries.GetAllMaterials(r.Context())
	if err != nil {
		log.Printf(`Invalid Material insertion, reason %s`, err)
		http.Error(w, `Internal Server Error`, http.StatusInternalServerError)
		return
	}

	log.Println("Fetched all Material")
	if err := json.NewEncoder(w).Encode(materials); err != nil {
		log.Printf("Could not create json obj: %s", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}
}

// postMaterialHandler is a handler that adds materials to the database godoc
//
//	@Summary		post materials to database
//	@Description	Adds materials to the database using valid json structure
//	@Tags			material
//	@Produce		json
//	@Accepts		json
//	@Param			material	body		materialdb.AddMaterialParams	true	"Format of add material request"
//	@Success		200			{object}	materialdb.Material				"material"
//	@Failure		400			{string}	string "bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/material/add [post]
func (e *Env) postMaterialHandler(w http.ResponseWriter, r *http.Request) {
	var material materialdb.AddMaterialParams

	if err := json.NewDecoder(r.Body).Decode(&material); err != nil {
		log.Printf("Could not parse json obj: %s", err)
		http.Error(w, "Bad Request", http.StatusBadRequest)
		return
	}

	if material.JobSite.Valid {
		id := strconv.Itoa(int(material.JobSite.Int64))
		resp, err := http.Get(e.UserHost + "/sites/search?id=" + id)
		if err != nil {
			log.Printf("Error occured while trying to connect to user api: %s", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		if resp.StatusCode != http.StatusOK {
			log.Printf("Invalid Jobsite Id  %s given", id)
			http.Error(w, "Bad request", http.StatusBadRequest)
			return
		}
	}

	ret, err := e.Queries.AddMaterial(r.Context(), material)
	if err != nil {
		log.Printf(`Invalid Material insertion, reason %s`, err)
		http.Error(w, `Could not add material`, http.StatusBadRequest)
		return
	}
	log.Printf("Material with id %d added", ret.ID)

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Printf("Could not create json obj: %s", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}

// changeMaterialQuantity is a handler that changes the quantity of the material and also the status if certain conditions are met godoc
//
//	@Summary		adjust quantity based on the requested amount
//	@Description	changes the quantity of the given material using it's id
//	@Tags			material
//	@Produce		json
//	@Accepts		json
//	@Param			material	body		materialdb.ChangeQuantityParams	true	"Format of changing material quantity"
//	@Success		200			{object}	materialdb.Material				"material"
//	@Failure		400			{string} string	"bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/material/change [put]
func (e *Env) changeMaterialQuantity(w http.ResponseWriter, r *http.Request) {
	var args materialdb.ChangeQuantityParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("Could not parse json obj: %s", err)
		http.Error(w, "Error parsing json", http.StatusBadRequest)
		return
	}

	material, err := e.Queries.ChangeQuantity(r.Context(), args)
	if err != nil {
		log.Printf(`Invalid Material change, reason %s`, err)
		http.Error(w, `Could not change material quantity`, http.StatusBadRequest)
		return
	}

	log.Printf("Changed quantity of material %s to %d", material.Name.String, args.Quantity)
	if material.Quantity < 30 && material.Quantity <= 0 {
		log.Printf(`Low material count for %v, changing status`, material.Name)
	}

	if material.Quantity <= 0 {
		log.Printf(`Out of material %v, changing status changed`, material.Name)
	}

	if err := json.NewEncoder(w).Encode(&material); err != nil {
		log.Printf("Could not create json obj: %s", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}

// deleteMaterialHandler handler to delete material from database
//
//	@Summary	deletes material
//	@Description	 deltes material from database
//	@Tags			material
//	@Produce		json
//	@Accepts		json
//	@Param			id	body		int	true	"Id of material to delete"
//	@Success		200			{object}	materialdb.Material				"delted material"
//	@Failure		400			{string} string	"bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/material/delete [delete]
func (e *Env) deleteMaterialHandler(w http.ResponseWriter, r *http.Request) {
	var id int64
	if err := json.NewDecoder(r.Body).Decode(&id); err != nil {
		log.Printf("Could not parse json obj: %s", err)
		http.Error(w, "Error parsing json", http.StatusBadRequest)
		return
	}

	log.Printf("Deleting material with id: %d", id)
	material, err := e.Queries.DeleteMaterial(r.Context(), id)
	if err != nil {
		log.Printf(`Invalid Material change, reason %s`, err)
		http.Error(w, `Could not delete material`, http.StatusBadRequest)
		return
	}

	if err := json.NewEncoder(w).Encode(&material); err != nil {
		log.Printf("Could not create json obj: %s", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}
