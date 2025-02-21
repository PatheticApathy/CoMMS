package handler

import (
	"context"
	"database/sql"
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
//	@Param			users	body		user_db.SignUpParams	true	"Format of signup user request"
//	@Success		200		{object}	user_db.User			"users"
//	@Failure		400		{string}	string					"Invalid input"
//	@Failure		500		{string}	string					"Failed to signup user"
//	@Router			/user/signup [post]
func (e *Env) SignUp(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling SignUp request")

	var params user_db.SignUpParams

	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received signup request for username: %s", params.Username)

	log.Println("Hashing user password")

	userandpass := auth.UserAndPass{
		Username: params.Username,
		Password: params.Password,
	}

	params.Password = auth.Hash(params.Password)

	log.Println("Attempting to create user in database")

	user, err := e.Queries.SignUp(context.Background(), params)
	if err != nil {
		log.Printf("Failed to signup user, reason: %v", err)
		http.Error(w, "Failed to signup user", http.StatusInternalServerError)
		return
	}

	log.Printf("User successfully created: %+v", user)

	log.Println("Marshaling user credentials for cookie storage")
	jsonUserandPass, err := json.Marshal(userandpass)
	if err != nil {
		log.Printf("Failed to marshal user credentials, reason: %v", err)
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

	log.Println("Writing encrypted cookie")
	err = auth.WriteEncrypted(w, cookie, []byte(e.Secret))
	if err != nil {
		log.Printf("Failed to write encrypted cookie, reason: %v", err)
		http.Error(w, "server error", http.StatusInternalServerError)
	}

	log.Println("Sending user response")
	if err := json.NewEncoder(w).Encode(&user); err != nil {
		log.Printf("Failed to encode user response, reason: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	log.Println("SignUp process completed successfully")
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
	log.Println("Handling createUser request")
	var params user_db.AddUserParams
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
	log.Printf("User successfully created: %+v", user)
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
//	@Param			users	body		map[string]interface{}	true	"Format of update user request"
//	@Success		200		{object}	user_db.User				"users"
//	@Failure		400		{string}	string						"Invalid input"
//	@Failure		500		{string}	string						"Failed to update user"
//	@Router			/user/update [put]
func (e *Env) updateUser(w http.ResponseWriter, r *http.Request) {
	log.Println("Handling updateUser request")
	var params map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		log.Printf("Failed to decode request body, reason: %v", err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	id, ok := params["id"].(float64)
	if !ok {
		log.Println("Missing or invalid 'id' parameter")
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	log.Printf("Received user update request: %+v", params)

	for field, value := range params {
		if field == "id" {
			continue
		}

		var err error
		switch field {
		case "username":
			_, err = e.Queries.UpdateUserUsername(context.Background(), user_db.UpdateUserUsernameParams{
				Username: value.(string),
				ID:       int64(id),
			})
		case "password":
			_, err = e.Queries.UpdateUserPassword(context.Background(), user_db.UpdateUserPasswordParams{
				Password: auth.Hash(value.(string)),
				ID:       int64(id),
			})
		case "firstname":
			_, err = e.Queries.UpdateUserFirstname(context.Background(), user_db.UpdateUserFirstnameParams{
				Firstname: parseNullString(value),
				ID:        int64(id),
			})
		case "lastname":
			_, err = e.Queries.UpdateUserLastname(context.Background(), user_db.UpdateUserLastnameParams{
				Lastname: parseNullString(value),
				ID:       int64(id),
			})
		case "company":
			_, err = e.Queries.UpdateUserCompany(context.Background(), user_db.UpdateUserCompanyParams{
				Company: parseNullString(value),
				ID:      int64(id),
			})
		case "site":
			_, err = e.Queries.UpdateUserSite(context.Background(), user_db.UpdateUserSiteParams{
				Site: parseNullString(value),
				ID:   int64(id),
			})
		case "role":
			_, err = e.Queries.UpdateUserRole(context.Background(), user_db.UpdateUserRoleParams{
				Role: parseNullString(value),
				ID:   int64(id),
			})
		case "email":
			_, err = e.Queries.UpdateUserEmail(context.Background(), user_db.UpdateUserEmailParams{
				Email: value.(string),
				ID:    int64(id),
			})
		case "phone":
			_, err = e.Queries.UpdateUserPhone(context.Background(), user_db.UpdateUserPhoneParams{
				Phone: value.(string),
				ID:    int64(id),
			})
		case "profilepicture":
			_, err = e.Queries.UpdateUserProfilePicture(context.Background(), user_db.UpdateUserProfilePictureParams{
				Profilepicture: parseNullString(value),
				ID:             int64(id),
			})
		default:
			log.Printf("Unknown field: %s", field)
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		if err != nil {
			log.Printf("Failed to update user field %s, reason: %v", field, err)
			http.Error(w, "Failed to update user", http.StatusInternalServerError)
			return
		}
	}

	log.Println("User successfully updated")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("User updated successfully"))
}

func parseNullString(value interface{}) sql.NullString {
	if v, ok := value.(string); ok {
		return sql.NullString{String: v, Valid: v != ""}
	}
	return sql.NullString{String: "", Valid: false}
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
	w.Write([]byte("User deleted"))
	log.Println("Delete user response successfully sent")
}
