package auth

import (
	"strconv"
	"time"

	"github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
	"github.com/o1egl/paseto"
)

type Identity = userdb.GetUserAndPassRow

// CreateToken creates a json token from user info containing username,password, and id. Must supply public and private key
func CreateToken(data Identity, secret []byte) (string, error) {
	pasetov2 := paseto.NewV2()

	token_payload := paseto.JSONToken{
		IssuedAt:   time.Now(),
		Audience:   "CoMMS User",
		Issuer:     "CoMMS",
		Subject:    "User identification",
		Expiration: time.Now().Add(24 * time.Hour),
	}

	token_payload.Set("username", data.Username)
	token_payload.Set("password", data.Password)
	token_payload.Set("id", strconv.Itoa(int(data.ID)))

	token, err := pasetov2.Encrypt(secret, token_payload, "Comms, The Material Managaer you can trust")
	if err != nil {
		return "", err
	}

	return token, nil
}

// VerifyToken returns the parsed json token and the footer of the
func VerifyToken(token string, secret []byte) (Identity, error) {
	var payload paseto.JSONToken
	var footer string

	pasetov2 := paseto.NewV2()

	err := pasetov2.Decrypt(token, secret, &payload, &footer)
	if err != nil {
		return Identity{}, err
	}

	id, err := strconv.Atoi(payload.Get("id"))
	if err != nil {
		// This should not happen unless a fabricated key was used
		return Identity{}, err
	}

	identity := Identity{
		Username: payload.Get("username"),
		Password: payload.Get("password"),
		ID:       int64(id),
	}

	return identity, nil
}
