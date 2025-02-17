package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/PatheticApathy/CoMMS/pkg/auth"

	_ "modernc.org/sqlite"
)

// authenticate handler that verifies user credentials and generates a cookie godoc
//
//	@Summary		Authenticate user information
//	@Description	Pulls user login information and authenticates the user
//	@Tags			users
//  @Accept			json
//  @Produce		string
//	@Param			users	body		user_db.UserAndPass		true	"Format of login user request"
//	@Success		200		{string}	string					"Success"
//	@Failure		400		{string}	string					"Invalid input"
//	@Failure		500		{string}	string					"Invalid User or Password"
//  @Failure		500		{string}	string					"Server Error"
//	@Router			/user/login [post]

func (e *Env) authenticate(w http.ResponseWriter, r *http.Request) {
	var userandpass auth.UserAndPass
	if err := json.NewDecoder(r.Body).Decode(&userandpass); err != nil {
		log.Println(err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	response, err := auth.CheckUserAndPass(e.Queries, r.Context(), userandpass)
	if err != nil || !response {
		log.Println(err)
		http.Error(w, "Invalid User or Password", http.StatusBadRequest)
		return
	}

	jsonUserandPass, err := json.Marshal(userandpass)
	if err != nil {
		log.Println(err)
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
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
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}

	if err := json.NewEncoder(w).Encode("Success"); err != nil {
		log.Printf("Could not encode json user, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	log.Printf("User successfully logged in")
}

//  loggout handler that removes an authentication cookie godoc
//
//	@Summary		Removes authenticated user information
//	@Description	Replaces login cookie with an empty one that deletes itself instantly
//	@Tags			users
//	@Success		200		{string}	string					"Success"
//	@Failure		400		{string}	string					"Invalid input"
//	@Router			/user/loggout [post]

func (e *Env) loggout(w http.ResponseWriter, _ *http.Request) {
	cookie := &http.Cookie{
		Name:     "LoginCookie",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}

	http.SetCookie(w, cookie)
}
