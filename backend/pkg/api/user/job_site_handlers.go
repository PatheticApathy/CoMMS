package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
)

// getJobSite hanlder returns a jobsite based on given parameters godoc
//
//	@Summary		fetches job_site based on given paremeters
//	@Security identity
//	@Description	Gets jobsites using id(may add more parameters later)
//	@Tags			sites
//	@Produce		json
//	@Param			id	query		int					true	"jobsite's identification number"
//	@Success		200	{object}	userdb.JobSite	"job site"
//	@Failure		400	{string} string	"bad request"
//	@Failure		500	{string}	string "Internal Server Error"
//	@Router			/sites/search [get]
func (e *Env) getJobSiteHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query.Has("id") {
		id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf("Invalid id, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		jobsite, err := e.Queries.GetJobSite(r.Context(), int64(id))
		if err != nil {
			log.Printf("Could not find job site, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}
		log.Printf("JobSite with id %d found", id)

		if err := json.NewEncoder(w).Encode(&jobsite); err != nil {
			log.Printf("Could not encode json jobsite, reason: %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}
}

// addJobSite handler that adds a jobsite to the the db  godoc
//
//	@Summary		post job_site to database
//	@Security identity
//	@Description	Adds job_site to the database using valid json structure
//	@Tags			sites
//	@Accept			json
//	@Produce		json
//	@Param			jobsite	body		userdb.AddJobSiteParams	true	"Format of add jobsite request"
//	@Success		200		{object}	userdb.JobSite				"jobsite"
//	@Failure		400		{string}	string "bad request"
//	@Failure		500		{string}	string "Internal Server Error"
//	@Router			/sites/add [post]
func (e *Env) addJobSiteHandler(w http.ResponseWriter, r *http.Request) {
	var args userdb.AddJobSiteParams
	if err := json.NewDecoder(r.Body).Decode(&args); err != nil {
		log.Printf("Could not decode json jobsite, reason: %s", err)
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}

	job_site, err := e.Queries.AddJobSite(r.Context(), args)
	if err != nil {
		log.Printf("Could not add job site, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	log.Printf("JobSite with id %d added", job_site.ID)

	if err := json.NewEncoder(w).Encode(&job_site); err != nil {
		log.Printf("Could not add job site, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// getAllJobSite handler returns all jobsites godoc
//
//	@Summary		fetches all job_sites
//	@Security identity
//	@Description	Get all jobsites
//	@Tags			sites
//	@Produce		json
//	@Success		200	 {array} 	userdb.JobSite	"job site"
//	@Failure		500	 {string} 	"Internal Server Error"
//	@Router			/sites/all [get]
func (e *Env) getAllJobSitesHandler(w http.ResponseWriter, r *http.Request) {
	jobsites, err := e.Queries.GetAllJobSites(r.Context())
	if err != nil {
		log.Printf("Could not get any jobsites, reason %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Fetching all JobSites")
	if err = json.NewEncoder(w).Encode(&jobsites); err != nil {
		log.Printf("Could not encode any jobsites to json, reason %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// getJobSitesByCompany handler returns all jobsites godoc
//
//	@Summary		fetches job_sites for a specific company
//	@Description	Get all jobsites for a specific company
//	@Tags			sites
//	@Produce		json
//	@Success		200	 {array} 	userdb.JobSite	"job site"
//	@Failure		500	 {string} 	"Internal Server Error"
//	@Router			/sites/company [get]
func (e *Env) getJobSitesByCompany(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query.Has("id") {
		id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf("Invalid id, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		jobsites, err := e.Queries.GetAllJobSitesByCompany(r.Context(), int64(id))
		if err != nil {
			log.Printf("Could not get any jobsites, reason %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		log.Printf("Fetching all JobSites for company %d", id)
		if err = json.NewEncoder(w).Encode(&jobsites); err != nil {
			log.Printf("Could not encode any jobsites to json, reason %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}
}
