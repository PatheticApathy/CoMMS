package middleware

import (
	"io"
	"log"
	"net/http"
	"slices"
	"strings"

	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/PatheticApathy/CoMMS/pkg/auth"
	"gopkg.in/yaml.v3"
)

type routeConfig struct {
	Routes map[string]struct {
		Methods []string `yaml:methods`
		Roles   []string `yaml:roles`
	} `yaml:routes`
}

// Parses the given yaml file for route configuration
func RouteConfig(reader io.Reader) (routeConfig, error) {
	var config routeConfig
	err := yaml.NewDecoder(reader).Decode(&config)
	return config, err
}

// Auth Controller is a extended version of the autrh middlware that takes the role strcut to generate proper aithentification
// for specidies routes
func AuthController(next http.Handler, e *handler.Env, config routeConfig) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if route, ok := config.Routes[r.URL.Path]; ok && slices.Contains(route.Methods, r.Method) {

			token := r.Header.Get("Authorization")
			token = strings.Trim(token, `"`)
			payload, err := auth.VerifyToken(token, []byte(e.Secret))
			if err != nil {
				log.Printf("Error: %s", err)
				http.Error(w, "Invalid Credentials", http.StatusBadRequest)
				return
			}

			validation, err := e.Queries.GetUserAndPass(r.Context(), payload.Username)
			if err != nil {
				log.Printf("Error: %s", err)
				http.Error(w, "Invalid Credentials", http.StatusBadRequest)
				return
			}

			if validation.Password == payload.Password && validation.Username == payload.Username {

				if !payload.Role.Valid {
					log.Print("If your seeing this message it's because your test account does not have a role. Fix it lol")
					http.Error(w, "Invalid Credentials", http.StatusBadRequest)
					return
				}

				for _, role := range route.Roles {
					if payload.Role.String == role {
						log.Printf("User %s successfully authenticated", payload.Username)
						next.ServeHTTP(w, r)
						return
					}
					log.Print("User role invalid for this route")
					http.Error(w, "Invalid Credentials", http.StatusBadRequest)
				}

			}
			log.Print("User credentials did not match database")
			http.Error(w, "Invalid Credentials", http.StatusBadRequest)
		} else {
			next.ServeHTTP(w, r)
		}
	})
}
