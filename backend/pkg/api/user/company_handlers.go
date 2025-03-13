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
//	@Summary		post company to database
//	@Description	Adds company to the database and assigns the user as a company admin
//	@Tags			companies
//	@Accept			json
//	@Produce		json
//	@Param			company	body		AddCompanyParams	true	"Format of add company request"
//	@Success		200		{object}	user_db.Company		"company"
//	@Failure		400		{string}	string				"Invalid input"
//	@Failure		500		{string}	string				"Failed to create company"
//	@Router			/company/create [post]
func (e *Env) createCompany(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling createCompany request")
	var params userdb.AddCompanyParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received company creation request: %+v", params)

	log.Println("Attempting to create company in database")
	company, err := e.Queries.AddCompany(context.Background(), params)
	if err != nil {
		log.Printf("Failed to create company, reason: %v", err)
		http.Error(w, "Failed to create company", http.StatusInternalServerError)
		return
	}

	log.Println("Company successfully created")
	if err := json.NewEncoder(w).Encode(&company); err != nil {
		log.Printf("Failed to encode company response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Company response successfully sent")

}
