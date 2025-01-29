package handler_test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	_ "modernc.org/sqlite"

	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/PatheticApathy/CoMMS/pkg/auth"
)

func AuthTest(t *testing.T) {
	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	env := handler.NewEnv(db)
	ts := httptest.NewServer(env.authenticate)

	defer ts.Close()

	usernpass := auth.UserAndPass{
		Username: "bob",
		Password: "bob",
	}

	jdata, err := json.Marshal(usernpass)
	buffer := bytes.NewReader(jdata)

	res, err := http.Post(ts.URL, "ContntType", buffer)

}
