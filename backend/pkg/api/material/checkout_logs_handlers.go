package material

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
)

// postMaterialLogsHandler adds checkout log when a material is checked out godoc
//
//	@Summary		post checkout of material
//	@Description	Adds checkout log for a materials
//	@Tags			checkout logs
//	@Accept			json
//	@Produce		json
//	@Param			checkoutlg	body		materialdb.AddCheckoutLogParams	true	"Format of add ckeckout log"
//	@Success		200			{object}	materialdb.CheckoutLog			"checkout log"
//	@Failure		400			{string} 	string	"bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/checkout/out [post]
func (e *Env) postCheckout(w http.ResponseWriter, r *http.Request) {
	var args materialdb.AddCheckoutLogParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("could not decode to json, reason %e", err)
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	resp, err := http.Get(e.UserHost + "/user/search?id=" + strconv.Itoa(int(args.UserID)))
	if err != nil {
		log.Printf("could not connect to user api, reason %e", err)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	if resp.StatusCode != http.StatusOK {
		log.Printf("could not add checkout log, invalid user id: %d", args.UserID)
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}

	checkout, err := e.Queries.AddCheckoutLog(r.Context(), args)
	if err != nil {
		log.Printf("could not add checkout log, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	log.Printf("Checkout log %d added, checked out", checkout.ID)
	if err = json.NewEncoder(w).Encode(&checkout); err != nil {
		log.Printf("could not encode to json, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}

// postMaterialLogsHandler adds material logs godoc
//
//	@Summary		Adds checkin time to existing checkout log
//	@Description	 Adds checkin time to existing checkout log
//	@Tags			checkout logs
//	@Accept			json
//	@Produce		json
//	@Param			logid	body		int64					true	"id of checkoutlog"
//	@Failure		400		{string}	string "bad request"
//	@Failure		500		{string} string "Internal Server Error"
//	@Success		200		{object}	materialdb.CheckoutLog	"checkout log"
//	@Router			/checkout/in [put]
func (e *Env) putCheckin(w http.ResponseWriter, r *http.Request) {
	var arg materialdb.UpdateCheckinlogParams
	if err := json.NewDecoder(r.Body).Decode(&arg); err != nil {
		log.Printf("could not decode to json, reason %e", err)
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}

	checkout, err := e.Queries.UpdateCheckinlog(r.Context(), arg)
	if err != nil {
		log.Printf("could not change checkout log, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	log.Printf("Checkout log %d now checked in", checkout.ID)
	if err = json.NewEncoder(w).Encode(&checkout); err != nil {
		log.Printf("could not encode to json, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}

// getAllMaterialLogsHandler gets all checkout logs
//
//	@Summary		fetches all checkout logs
//	@Description	gets all checkout logs if they exist
//	@Tags			checkout logs
//	@Produce		json
//	@Success		200	{array}	materialdb.CheckoutLog	"checkout logs"
//	@Failure		500	{string} string	"Internal Server Error"
//	@Router			/checkout/all [get]
func (e *Env) getAllCheckoutLogs(w http.ResponseWriter, r *http.Request) {
	logs, err := e.Queries.GetAllCheckoutLogs(r.Context())
	if err != nil {
		log.Printf("could not get checkout logs, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}

	log.Printf("Fetching all Checkout logs")
	if err = json.NewEncoder(w).Encode(&logs); err != nil {
		log.Printf("could not encode to json, reason %e", err)
		http.Error(w, "internal server error", http.StatusInternalServerError)
		return
	}
}

// getRecentCheckoutLogsForMaterialHandler gets recent checkout logs based on given id godoc
//
//	@Summary		fetches recent checkout logs for a given material id
//	@Description	Safer and faster way to get newest checkout logs for given material
//	@Tags			checkout logs
//	@Produce		json
//	@Param			id			query		int						true	"id of material"
//	@Success		200			{array}	materialdb.CheckoutLog	"checkout logs"
//	@Failure		400			{string} string	"bad request"
//	@Failure		500			{string} string	"Internal Server Error"
//	@Router			/checkout/recent [get]
func (e *Env) getRecentCheckoutLogsForMaterialHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query.Has("id") {

		id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf("Invalid material log id, reason %e", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		material_log, err := e.Queries.GetRecentCheckoutLogsForMaterial(r.Context(), int64(id))
		if err != nil {
			log.Printf("Invalid material log id, reason %e", err)
			http.Error(w, "bad request", http.StatusBadRequest)
			return
		}

		log.Printf("Found checkout log %d", id)

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
