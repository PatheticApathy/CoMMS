package handler

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

// TODO: document
// TODO: add verification of cookie

type externalQuery struct {
	// services include geo and material as o now
	Service string          `json:"service"`
	Url     string          `json:"url"`
	Method  string          `json:"method"`
	Body    json.RawMessage `json:"body"`
}

func (e *Env) externalQueryHandler(w http.ResponseWriter, r *http.Request) {
	var query externalQuery
	if err := json.NewDecoder(r.Body).Decode(&query); err != nil {
		log.Printf("Invalid request: %e", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	// verify token/cookies
	// oo
	//
	//
	//

	// get service to route to
	var url string
	switch query.Service {
	case "material":
		url = e.MaterialApiHost + query.Url

	case "geo":
		url = e.NominatimHost + query.Url

	default:
		log.Println("Bad service type given")
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// forward request to another server in  our network
	switch query.Method {
	case "GET":
		resp, _ := http.Get(url)
		resp.Write(w)
		return

	case "POST":
		body, err := query.Body.MarshalJSON()
		if err != nil {
			log.Printf("Bad body in request: %e", err)
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}

		resp, err := http.Post(url, "application/json", bytes.NewBuffer(body))
		if err != nil {
			log.Printf("Bad request: %e", err)
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}

		resp.Write(w)

	case "PUT":
		body, err := query.Body.MarshalJSON()
		if err != nil {
			log.Printf("Bad body in request: %e", err)
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}

		resp, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(body))
		if err != nil {
			log.Printf("Bad request: %e", err)
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}

		resp.Write(w)

	case "DELETE":
		body, err := query.Body.MarshalJSON()
		if err != nil {
			log.Printf("Bad body in request: %e", err)
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}

		resp, err := http.NewRequest(http.MethodPost, url, bytes.NewReader(body))
		if err != nil {
			log.Printf("Bad request: %e", err)
			http.Error(w, "Invalid request format", http.StatusBadRequest)
			return
		}

		resp.Write(w)

	default:
		log.Println("Bad method given")
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}
}
