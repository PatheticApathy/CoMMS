package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/PatheticApathy/CoMMS/pkg/auth"

	_ "modernc.org/sqlite"
)

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
}

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
