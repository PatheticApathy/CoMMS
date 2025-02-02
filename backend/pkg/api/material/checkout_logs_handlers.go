package material

import (
	"encoding/json"
	"log"
	"net/http"

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
//	@Failure		400			{string} string	"bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/checkouts/out [post]
func (e *Env) postCheckout(w http.ResponseWriter, r *http.Request) {
	var args materialdb.AddCheckoutLogParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("could not decode to json, reason %e", err)
		http.Error(w, "bad request", http.StatusBadRequest)
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
//	@Summary		post material log to database
//	@Description	Adds material log  to the database using valid json structure
//	@Tags			checkout logs
//	@Accept			json
//	@Produce		json
//	@Param			logid	body		int64					true	"id of checkoutlog"
//	@Failure		400		{string}	string "bad request"
//	@Failure		500		{string} string "Internal Server Error"
//	@Success		200		{object}	materialdb.CheckoutLog	"checkout log"
//	@Router			/checkouts/in [put]
func (e *Env) putCheckin(w http.ResponseWriter, r *http.Request) {
	var arg int64
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
//	@Router			/checkouts/all [get]
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
