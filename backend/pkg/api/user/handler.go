package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/PatheticApathy/CoMMS/pkg/auth"
	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"

	_ "modernc.org/sqlite"
)

// getUser hanlder returns a user based on given parameters godoc
//
//	@Summary		fetches user based on given paremeters
//	@Description	Gets user using id(may add more parameters later)
//	@Tags			users
//	@Produce		json
//	@Param			id	query		int				true	"user's identification number"
//	@Success		200	{object}	userdb.User		"users"
//	@Failure		400	{string}	string			"Invalid id"
//	@Failure		500	{string}	string			"Internal Server Error"
//	@Router			/user/search [get]
func (e *Env) getUser(w http.ResponseWriter, r *http.Request) {
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

		log.Printf("Fetching user with id: %d", id)
		user, err := e.Queries.GetUser(r.Context(), int64(id))
		if err != nil {
			log.Printf("Could not find user, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		log.Printf("User found: %+v", user)
		if err := json.NewEncoder(w).Encode(&user); err != nil {
			log.Printf("Could not encode json user, reason: %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		log.Println("User response successfully sent")
	}
}

// getUserName hanlder returns a user based on given parameters godoc
//
//	@Summary		fetches user based on given paremeters
//	@Description	Gets user using username
//	@Tags			users
//	@Produce		json
//	@Param			username query	string			true	"user's identification number"
//	@Success		200	{object}	userdb.User		"users"
//	@Failure		400	{string}	string			"Invalid username"
//	@Failure		500	{string}	string			"Internal Server Error"
//	@Router			/user/search [get]
func (e *Env) getUserName(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling getUserName request")
	query := r.URL.Query()
	if query.Has("username") {
		username := query.Get("username")
		log.Printf("Received request with username: %s", username)

		log.Printf("Fetching user with username: %s", username)
		user, err := e.Queries.GetUserName(r.Context(), string(username))
		if err != nil {
			log.Printf("Could not find user, reason: %e", err)
			http.Error(w, "Invalid username", http.StatusBadRequest)
			return
		}

		log.Printf("User found: %+v", user)
		if err := json.NewEncoder(w).Encode(&user); err != nil {
			log.Printf("Could not encode json user, reason: %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		log.Println("User response successfully sent")
	}
}

// getUsers hanlder returns all users godoc
//
//	@Summary		fetches all users
//	@Description	Gets users
//	@Tags			users
//	@Produce		json
//	@Success		200	{object}	userdb.User		"users"
//	@Failure		500	{string}	string			"Faliled to get users"
//	@Router			/user/all [get]
func (e *Env) getUsers(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling getUsers request")
	log.Println("Fetching all users from the database")
	users, err := e.Queries.GetAllUsers(r.Context())
	if err != nil {
		log.Printf("Failed to get users, reason: %v", err)
		http.Error(w, "Failed to get users", http.StatusInternalServerError)
		return
	}
	log.Printf("Successfully retrieved %d users", len(users))
	if err := json.NewEncoder(w).Encode(&users); err != nil {
		log.Printf("Failed to encode users response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("Users response successfully sent")
}

// SignUp handler that adds a user to the the db  godoc
//
//	@Summary		post user to database
//	@Description	Adds user to the database using valid json structure
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			users	body		userdb.SignUpParams	true	"Format of signup user request"
//	@Success		200		{string}	string			"User login token"
//	@Failure		400		{string}	string					"Invalid input"
//	@Failure		500		{string}	string					"Failed to signup user"
//	@Router			/user/signup [post]
func (e *Env) SignUp(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling SignUp request")

	var params userdb.SignUpParams

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received signup request for username: %s", params.Username)

	log.Println("Hashing user password")

	params.Password = auth.Hash(params.Password)

	log.Println("Attempting to create user in database")

	user, err := e.Queries.SignUp(context.Background(), params)
	if err != nil {
		log.Printf("Failed to signup user, reason: %v", err)
		http.Error(w, "Failed to signup user", http.StatusInternalServerError)
		return
	}

	// create token and save public key
	identity := auth.Identity{
		Username: user.Username,
		Password: user.Password,
		ID:       user.ID,
	}

	token, err := auth.CreateToken(identity, []byte(e.Secret))
	if err != nil {
		log.Printf("Could not create id token: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// send to client
	if err := json.NewEncoder(w).Encode(&token); err != nil {
		log.Printf("Could not encode json token, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Printf("User successfully created: %+v", user)
}

// createUser handler that adds a user to the the db  godoc
//
//	@Summary		post user to database
//	@Description	Adds user to the database using valid json structure
//	@Security identity
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			users	body		userdb.AddUserParams	true	"Format of add user request"
//	@Success		200		{object}	userdb.User			"users"
//	@Failure		400		{string}	string					"Invalid input"
//	@Failure		500		{string}	string					"Failed to create user"
//	@Router			/user/create [post]
func (e *Env) createUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling createUser request")
	var params userdb.AddUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received user creation request: %+v", params)

	log.Println("Attempting to create user in database")
	user, err := e.Queries.AddUser(context.Background(), params)
	if err != nil {
		log.Printf("Failed to create user, reason: %v", err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	log.Printf("User %s successfully created", user.Username)
	if err := json.NewEncoder(w).Encode(&user); err != nil {
		log.Printf("Failed to encode user response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("User response successfully sent")
}

// updateUser handler returns an updated user based on given parameters godoc
//
//	@Summary		updates user based on given parameters
//	@Description	Updates user using id(may add more parameters later)
//	@Tags			users
//	@Produce		json
//	@Param			users	body		userdb.UpdateUserParams  	true	"Format of update user request"
//	@Success		200		{object}	userdb.User					"users"
//	@Failure		400		{string}	string						"Invalid input"
//	@Failure		500		{string}	string						"Failed to update user"
//	@Router			/user/update [put]
func (e *Env) updateUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling updateUser request")
	var params userdb.UpdateUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received user update request: %v", params)
	log.Printf("Attempting to update user with id: %d", params.ID)

	user, err := e.Queries.UpdateUser(r.Context(), params)
	if err != nil {
		log.Printf("Failed to update user %s, reason: %v", user.Username, err)
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}

	log.Printf("User %s successfully updated", user.Username)
	if err := json.NewEncoder(w).Encode(&user); err != nil {
		log.Printf("Failed to encode user response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}

// deleteUser hanlder removes a user based on given parameters godoc
//
//	@Summary		removes user based on given paremeters
//	@Description	Deletes user using id(may add more parameters later)
//	@Tags			users
//	@Produce		json
//	@Param			id	query		int				true	"user's identification number"
//	@Success		200	{object}	userdb.User		"users"
//	@Failure		400	{string}	string			"Invalid user ID"
//	@Failure		500	{string}	string			"Failed to delete user"
//	@Router			/user/delete [delete]
func (e *Env) deleteUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling deleteUser request")
	idStr := r.URL.Query().Get("id")
	if idStr == "" {
		log.Println("Missing 'id' parameter in query")
		http.Error(w, "Missing user ID", http.StatusBadRequest)
		return
	}

	log.Printf("Received request to delete user with ID: %s", idStr)
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Printf("Invalid user ID format: %s, reason: %v", idStr, err)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	log.Printf("Attempting to delete user with ID: %d", userID)
	err = e.Queries.DeleteUser(context.Background(), int64(userID))
	if err != nil {
		log.Printf("Failed to delete user with ID: %d, reason: %v", userID, err)
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}
	log.Printf("User with ID: %d successfully deleted", userID)
}
