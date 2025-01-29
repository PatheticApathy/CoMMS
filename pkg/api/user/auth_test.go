package handler

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	_ "modernc.org/sqlite"

	"github.com/PatheticApathy/CoMMS/pkg/auth"
)

func AuthTest(t *testing.T) {
	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	env := NewEnv(db)
	ts := httptest.NewServer(http.HandlerFunc(env.authenticate))

	defer ts.Close()

	usernpass := auth.UserAndPass{
		Username: "bob",
		Password: "bob",
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

	t.Log(cookies[0].Name)

}
