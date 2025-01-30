package handler

import (
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	_ "modernc.org/sqlite"

	"github.com/PatheticApathy/CoMMS/pkg/auth"
	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"
)

func TestAuth(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	env := NewEnv(db)

	passwrd := auth.Hash("bassword")
	adduser := user_db.AddUserParams{
		Username:  "bob",
		Password:  passwrd,
		Firstname: "Bob",
		Lastname:  "Bobbert",
		Company:   "BobbyBuilds",
		Site:      "Bobbytown",
		Role:      "user",
		Email:     "bobbert@gmail.com",
		Phone:     "1",
	}
	user, err := env.Queries.AddUser(context.Background(), adduser)
	if err != nil {
		t.Fatal(err)
	}

	ts := httptest.NewServer(http.HandlerFunc(env.authenticate))

	defer ts.Close()

	usernpass := auth.UserAndPass{
		Username: "bob",
		Password: "bassword",
	}

	jdata, err := json.Marshal(usernpass)
	if err != nil {
		t.Fatal(err)
	}
	buffer := bytes.NewReader(jdata)

	res, err := http.Post(ts.URL, "application/json", buffer)
	if err != nil {
		t.Fatal(err)
	}
	cookies := res.Cookies()

	if err = env.Queries.DeleteUser(context.Background(), user.ID); err != nil {
		t.Fatal(err)
	}

	t.Logf("Cookie name: %s, Cookie value: %s", cookies[0].Name, cookies[0].Value)
}
