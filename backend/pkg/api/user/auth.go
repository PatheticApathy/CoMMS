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
//		@Summary		Authenticate user information
//		@Description	Pulls user login information and authenticates the user
//		@Tags			users
//	  @Accept			json
//		@Param			users	body		auth.UnEncrypted		true	"Format of login user request"
//		@Success		200		{object}	auth.Token					"User login token"
//		@Failure		400		{string}	string					"Invalid input"
//		@Failure		500		{string}	string					"Invalid User or Password"
//	  @Failure		500		{string}	string					"Server Error"
//		@Router			/user/login [post]
func (e *Env) authenticate(w http.ResponseWriter, r *http.Request) {
	var userandpass auth.UnEncrypted
	log.Println("Got User and Pass")
	if err := json.NewDecoder(r.Body).Decode(&userandpass); err != nil {
		log.Println(err)
		http.Error(w, "Invalid input", http.StatusBadRequest)
		return
	}
	log.Printf("Checking user %s", userandpass.Username)
	err := auth.CheckUserAndPass(e.Queries, r.Context(), &userandpass)
	if err != nil {
		log.Println(err)
		http.Error(w, "Invalid User or Password", http.StatusBadRequest)
		return
	}
	log.Println("Repackaging userandpass to json")
	jsonUserandPass, err := json.Marshal(userandpass)
	if err != nil {
		log.Println(err)
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}
	log.Println("Generating cookie")
	cookie := http.Cookie{
		Name:     "LoginCookie",
		Value:    string(jsonUserandPass),
		Path:     "/",
		MaxAge:   0,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteLaxMode,
	}
	log.Println("Encrypting Cookie")
	encrypted, err := auth.WriteEncrypted(w, cookie, []byte(e.Secret))
	if err != nil {
		log.Println(err)
		http.Error(w, "Server Error", http.StatusInternalServerError)
		return
	}
	log.Println("Encoding json")
	token := auth.Token{
		Token: encrypted,
	}
	if err := json.NewEncoder(w).Encode(&token); err != nil {
		log.Printf("Could not encode json user, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	log.Printf("User successfully logged in")
}

//	 loggout handler that removes an authentication cookie godoc
//
//		@Summary		Removes authenticated user information
//		@Description	Replaces login cookie with an empty one that deletes itself instantly
//		@Tags			users
//		@Success		200		{string}	string					"Success"
//		@Failure		400		{string}	string					"Invalid input"
//		@Router			/user/loggout [post]
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

// DecryptHandler decrypts token godoc
//
//		@Summary		 Decrypts token
//		@Description	 Decrypt user login token
//		@Tags			users
//	  @Accept			json
//		@Param			users	body		auth.Token		true	"Format of login user request"
//		@Success		200		{object}	auth.UnEncrypted					"User login data token"
//		@Failure		400		{string}	string					"Invalid request"
//	  @Failure		500		{string}	string					"Server Error"
//		@Router			/user/decrypt [post]
func (e *Env) DecryptHanlder(w http.ResponseWriter, r *http.Request) {
	var token auth.Token
	if err := json.NewEncoder(w).Encode(&token); err != nil {
		log.Printf("Could not encode json token, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	decrypt_token, err := auth.ReadEncrypted(r, "LoginCookie", []byte(e.Secret))
	if err != nil {
		log.Printf("Error for authorization request: %e", err)
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if err := json.NewEncoder(w).Encode(&decrypt_token); err != nil {
		log.Printf("Could not encode json user, reason: %e", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
}
