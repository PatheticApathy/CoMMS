package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"

	_ "modernc.org/sqlite"
)

// getCompany hanlder returns a company based on given parameters godoc
//
//	@Summary		fetches company based on given paremeters
//	@Description	Gets company using id
//	@Tags			companies
//	@Produce		json
//	@Param			id	query		int				true	"company's identification number"
//	@Success		200	{object}	userdb.Company		"company"
//	@Failure		400	{string}	string			"Invalid id"
//	@Failure		500	{string}	string			"Internal Server Error"
//	@Router			/company/search [get]
func (e *Env) getCompany(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling getUser request")
	query := r.URL.Query()
	if query.Has("id") {
		id, err := strconv.Atoi(query.Get("id"))
		log.Printf("Received request with id: %d", id)
		if err != nil {
			log.Printf("Invalid id, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		log.Printf("Fetching company with id: %d", id)
		user, err := e.Queries.GetCompany(r.Context(), int64(id))
		if err != nil {
			log.Printf("Could not find company, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		log.Printf("Company found: %+v", user)
		if err := json.NewEncoder(w).Encode(&user); err != nil {
			log.Printf("Could not encode json company, reason: %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		log.Println("Company response successfully sent")
	}
}

// getCompanies hanlder returns all companies godoc
//
//	@Summary		fetches all companies
//	@Description	Gets companies
//	@Tags			companies
//	@Produce		json
//	@Success		200	{object}	userdb.Company		"company"
//	@Failure		500	{string}	string			"Faliled to get companies"
//	@Router			/company/all [get]
func (e *Env) getCompanies(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling getUsers request")
	log.Println("Fetching all companies from the database")
	users, err := e.Queries.GetAllCompanies(r.Context())
	if err != nil {
		log.Printf("Failed to get companies, reason: %v", err)
		http.Error(w, "Failed to get companies", http.StatusInternalServerError)
		return
	}
	log.Printf("Successfully retrieved %d companies", len(users))
	if err := json.NewEncoder(w).Encode(&users); err != nil {
		log.Printf("Failed to encode companies response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Companies response successfully sent")
}

// createCompany handler that adds a company and assigns the user as a company admin
//
//	@Summary		post company to database
//	@Description	Adds company to the database and assigns the user as a company admin
//	@Tags			companies
//	@Accept			json
//	@Produce		json
//	@Param			company	body		userdb.AddCompanyParams	true	"Format of add company request"
//	@Success		200		{object}	userdb.Company		"company"
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
