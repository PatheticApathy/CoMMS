// middleware functions for go handlers
package middleware

import (
	"log"
	"net/http"
	"time"

	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/PatheticApathy/CoMMS/pkg/auth"
)

type middleware func(http.Handler) http.Handler

// Json sets the headers to be json
func Json(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

// Logsger logs a requets maed to the server and the time spent making the request
func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Println(r.Method, r.URL.Path, time.Since(start))
	})
}

// Auth middlware locks sub routes unless user is authenticated
func Auth(next http.Handler, e *handler.Env, role string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		token := r.Header.Get("Authorization")
		payload, err := auth.VerifyToken(token, []byte(e.Secret))
		if err != nil {
			log.Printf("Error: %e", err)
			http.Error(w, "Internal Server Error", http.StatusInternalServerError)
			return
		}

		validation, err := e.Queries.GetUserAndPass(r.Context(), payload.Username)
		if err != nil {
			log.Printf("Error: %e", err)
			http.Error(w, "Invalid Credentials", http.StatusBadRequest)
			return
		}

		if validation.Password == payload.Password && validation.Username == payload.Username {

			if role != "" && !payload.Role.Valid {
				log.Print("If your seeing this message it's because your test account does not have a role. Fix it lol")
				http.Error(w, "Invalid Credentials", http.StatusBadRequest)
				return
			}

			if role == "" || payload.Role.String == role {
				log.Printf("User %s successfully authenticated", payload.Username)
				next.ServeHTTP(w, r)
				return
			}
			log.Print("User role invalid for this route")
			http.Error(w, "Invalid Credentials", http.StatusBadRequest)
		}

		log.Print("User credentials did not match database")
		http.Error(w, "Invalid Credentials", http.StatusBadRequest)
	})
}

func Middlewares(middl ...middleware) middleware {
	return func(next http.Handler) http.Handler {
		for i := len(middl) - 1; i >= 0; i-- {
			nx := middl[i]
			next = nx(next)
		}
		return next
	}
}
