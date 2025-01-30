package handler

import (
	"encoding/json"
	"log"
	"net/http"
)

type externalQuery struct {
	Token  string `json:"token"`
	Url    string `json:"url"`
	Method string `json:"method"`
}

func (e *Env) externalQueryHandler(w http.ResponseWriter, r *http.Request) {
	var query externalQuery
	if err := json.NewDecoder(r.Body).Decode(&query); err != nil {
		log.Printf("Invalid request: %e", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
	}

	// verify token

	// PAss request to appropriate server

	// return resp
}
