package material

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
)

// postAddUser is a handler that adds a user to the database godoc
//
//	@Summary		 adds user to the material database
//	@Description	 The use defined in the material database is only the bear essentials for logging
//	@Tags			user
//	@Produce		json
//	@Accepts		json
//	@Param			user	body		materialdb.AddUserParams	true	"Format of add user request"
//	@Success		200			{object}	materialdb.User				"user"
//	@Failure		400			{string}	string "bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/user/add [post]
func (e *Env) postAddUser(w http.ResponseWriter, r *http.Request) {
	var user materialdb.AddUserParams

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Printf("Could not parse json obj: %e", err)
		http.Error(w, "Error parsing json", http.StatusBadRequest)
		return
	}

	ret, err := e.Queries.AddUser(r.Context(), user)
	if err != nil {
		log.Printf(`Invalid User insertion, reason %e`, err)
		http.Error(w, `Could not add material`, http.StatusBadRequest)
		return
	}

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Printf("Could not create json obj: %e", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}

// getUser is a handler that gets a user from the database godoc
//
//	@Summary		 get user from the material database
//	@Description	 gets user from db
//	@Tags			user
//	@Produce		json
//	@Param			id	path		materialdb.AddUserParams	true	"id of user"
//	@Success		200			{object}	materialdb.User				"user"
//	@Failure		400			{string}	string "bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/user/{id} [get]
func (e *Env) getUser(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	if query.Has("id") {
		id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf(`Invalid id, reason %e`, err)
			http.Error(w, `bad request`, http.StatusBadRequest)
			return
		}

		ret, err := e.Queries.GetUser(r.Context(), int64(id))
		if err != nil {
			log.Printf(`Invalid User insertion, reason %e`, err)
			http.Error(w, `Could not add user`, http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(ret); err != nil {
			log.Printf("Could not create json obj: %e", err)
			http.Error(w, "Error creating json", http.StatusInternalServerError)
			return
		}
	}
}

// getAllUsers is a handler that gets all user from the database godoc
//
//	@Summary		 gets all users from the material database
//	@Description	 gets all users from db
//	@Tags			user
//	@Produce		json
//	@Success		200			{array}	materialdb.User				"user"
//	@Failure		400			{string}	string "bad request"
//	@Failure		500			{string}	string "Internal Server Error"
//	@Router			/user/all [get]
func (e *Env) getAllUsers(w http.ResponseWriter, r *http.Request) {
	ret, err := e.Queries.GetAllUsers(r.Context())
	if err != nil {
		log.Printf(`No users, reason %e`, err)
		http.Error(w, `Could not get users`, http.StatusBadRequest)
		return
	}

	if err := json.NewEncoder(w).Encode(ret); err != nil {
		log.Printf("Could not create json obj: %e", err)
		http.Error(w, "Error creating json", http.StatusInternalServerError)
		return
	}
}
