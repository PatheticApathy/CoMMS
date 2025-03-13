package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
	_ "modernc.org/sqlite"
)

// createCompany handler that adds a company and assigns the user as a company admin
//
//	@Summary		post jobsite to database
//	@Description	Adds jobsite to the database
//	@Tags			jobsites
//	@Accept			json
//	@Produce		json
//	@Param			jobsite	body		AddCompanyParams	true	"Format of add company request"
//	@Success		200		{object}	user_db.Jobsites	"jobsite"
//	@Failure		400		{string}	string				"Invalid input"
//	@Failure		500		{string}	string				"Failed to create company"
//	@Router			/jobsite/create [post]
func (e *Env) createJobsite(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling createJobsite request")
	var params userdb.AddJobsiteParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received jobsite creation request: %+v", params)

	log.Println("Attempting to create jobsite in database")
	jobsite, err := e.Queries.AddJobsite(context.Background(), params)
	if err != nil {
		log.Printf("Failed to create jobsite, reason: %v", err)
		http.Error(w, "Failed to create jobsite", http.StatusInternalServerError)
		return
	}

	log.Println("Jobsite successfully created")
	if err := json.NewEncoder(w).Encode(&jobsite); err != nil {
		log.Printf("Failed to encode jobsite response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Jobsite response successfully sent")

}
