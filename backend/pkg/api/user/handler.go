package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	auth "github.com/PatheticApathy/CoMMS/pkg/auth"
	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"

	_ "modernc.org/sqlite"
)

// getUser hanlder returns a user based on given parameters godoc
//
//	@Summary		fetches user based on given paremeters
//	@Description	Gets user using id(may add more parameters later)
//	@Tags			users
//	@Produce		json
//	@Param			id	query		int				true	"user's identification number"
//	@Success		200	{object}	user_db.User	"users"
//	@Failure		400	{string}	string			"Invalid id"
//	@Failure		500	{string}	string			"Internal Server Error"
//	@Router			/user/search [get]
func (e *Env) getUser(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()

	if query.Has("id") {
		id, err := strconv.Atoi(query.Get("id"))
		if err != nil {
			log.Printf("Invalid id, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		user, err := e.Queries.GetUser(r.Context(), int64(id))
		if err != nil {
			log.Printf("Could not find user, reason: %e", err)
			http.Error(w, "Invalid id", http.StatusBadRequest)
			return
		}

		if err := json.NewEncoder(w).Encode(&user); err != nil {
			log.Printf("Could not encode json user, reason: %e", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}
}

// getUsers hanlder returns all users godoc
//
//	@Summary		fetches all users
//	@Description	Gets users
//	@Tags			users
//	@Produce		json
//	@Success		200	{object}	user_db.User	"users"
//	@Failure		500	{string}	string			"Faliled to get users"
//	@Router			/user/all [get]
func (e *Env) getUsers(w http.ResponseWriter, r *http.Request) {
	users, err := e.Queries.GetAllUsers(r.Context())
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to get users", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(&users)
}

// SignUp handler that adds a user to the the db  godoc
//
//	@Summary		post user to database
//	@Description	Adds user to the database using valid json structure
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			users	body		user_db.SignUpParams	true	"Format of signup user request"
//	@Success		200		{object}	user_db.User			"users"
//	@Failure		400		{string}	string					"Invalid input"
//	@Failure		500		{string}	string					"Failed to signup user"
//	@Router			/user/signup [post]
func (e *Env) SignUp(w http.ResponseWriter, r *http.Request) {
	var params user_db.SignUpParams
	hash_pass := auth.Hash(params.Password)
	userandpass := auth.UserAndPass{
		Username: params.Username,
		Password: params.Password,
	}
	params.Password = hash_pass

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Println(err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	params.Password = auth.Hash(params.Password)

	user, err := e.Queries.SignUp(context.Background(), params)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to signup user", http.StatusInternalServerError)
		return
	}

	jsonUserandPass, err := json.Marshal(userandpass)
	if err != nil {
		log.Println(err)
		http.Error(w, "Server Error", http.StatusInternalServerError)
	}
	cookie := http.Cookie{
		Name:     "LoginCookie",
		Value:    string(jsonUserandPass),
		Path:     "/",
		MaxAge:   0,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}

	err = auth.WriteEncrypted(w, cookie, []byte(e.Secret))
	if err != nil {
		log.Println(err)
		http.Error(w, "server error", http.StatusInternalServerError)
	}

	json.NewEncoder(w).Encode(&user)
}

// createUser handler that adds a user to the the db  godoc
//
//	@Summary		post user to database
//	@Description	Adds user to the database using valid json structure
//	@Tags			users
//	@Accept			json
//	@Produce		json
//	@Param			users	body		user_db.AddUserParams	true	"Format of add user request"
//	@Success		200		{object}	user_db.User			"users"
//	@Failure		400		{string}	string					"Invalid input"
//	@Failure		500		{string}	string					"Failed to create user"
//	@Router			/user/create [post]
func (e *Env) createUser(w http.ResponseWriter, r *http.Request) {
	var params user_db.AddUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Println(err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	user, err := e.Queries.AddUser(context.Background(), params)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(&user)
}

// updateUser hanlder returns an updated user based on given parameters godoc
//
//	@Summary		updates user based on given paremeters
//	@Description	Updates user using id(may add more parameters later)
//	@Tags			users
//	@Produce		json
//	@Param			users	body		user_db.UpdateUserParams	true	"Format of update user request"
//	@Success		200		{object}	user_db.User				"users"
//	@Failure		400		{string}	string						"Invalid input"
//	@Failure		500		{string}	string						"Failed to update user"
//	@Router			/user/update [put]
func (e *Env) updateUser(w http.ResponseWriter, r *http.Request) {
	var params user_db.UpdateUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Println(err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	user, err := e.Queries.UpdateUser(context.Background(), params)
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(&user)
}

// deleteUser hanlder removes a user based on given parameters godoc
//
//	@Summary		removes user based on given paremeters
//	@Description	Deletes user using id(may add more parameters later)
//	@Tags			users
//	@Produce		json
//	@Param			id	query		int				true	"user's identification number"
//	@Success		200	{object}	user_db.User	"users"
//	@Failure		400	{string}	string			"Invalid user ID"
//	@Failure		500	{string}	string			"Failed to delete user"
//	@Router			/user/delete [delete]
func (e *Env) deleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	err = e.Queries.DeleteUser(context.Background(), int64(userID))
	if err != nil {
		log.Println(err)
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("User deleted"))
}
