// middleware functions for go handlers
package middleware

import (
	"log"
	"net/http"
	"time"
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

func Middlewares(middl ...middleware) middleware {
	return func(next http.Handler) http.Handler {
		for i := len(middl) - 1; i >= 0; i-- {
			nx := middl[i]
			next = nx(next)
		}
		return next
	}
}
