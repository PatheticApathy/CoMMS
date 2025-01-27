package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"

	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"

	_ "modernc.org/sqlite"
)

func (e *Env) getUsers(w http.ResponseWriter, r *http.Request) {
	users, err := e.Queries.GetAllUsers(r.Context())
	if err != nil {
		http.Error(w, "Failed to get users", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(users)
}

func (e *Env) getUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	user, err := e.Queries.GetUser(context.Background(), int64(userID))
	if err != nil {
		http.Error(w, "Failed to get user", http.StatusInternalServerError)
		return
	}
	if err := json.NewEncoder(w).Encode(user); err != nil {
		//...
	}
}

func (e *Env) createUser(w http.ResponseWriter, r *http.Request) {
	var params user_db.AddUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	user, err := e.Queries.AddUser(context.Background(), params)
	if err != nil {
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func (e *Env) updateUser(w http.ResponseWriter, r *http.Request) {
	var params user_db.UpdateUserParams
	if err := json.NewDecoder(r.Body).Decode(&params); err != nil {
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}

	user, err := e.Queries.UpdateUser(context.Background(), params)
	if err != nil {
		http.Error(w, "Failed to update user", http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(user)
}

func (e *Env) deleteUser(w http.ResponseWriter, r *http.Request) {
	idStr := r.URL.Query().Get("id")
	userID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	err = e.Queries.DeleteUser(context.Background(), int64(userID))
	if err != nil {
		http.Error(w, "Failed to delete user", http.StatusInternalServerError)
		return
	}
	w.Write([]byte("User deleted"))
}
