package test

import (
	"bytes"
	"database/sql"
	"net/http"
	"net/http/httptest"
	"net/http/httputil"
	"net/url"
	"testing"

	"github.com/PatheticApathy/CoMMS/pkg/api/material"
	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/PatheticApathy/CoMMS/pkg/middleware"
	_ "modernc.org/sqlite"
)

var (
	mserver *httptest.Server
	userver *httptest.Server
)

func TestMain(m *testing.M) {
	// start both db's
	mdb, err := sql.Open("sqlite", "../databases/Materialdb/materials.db")
	if err != nil {
		panic("No database")
	}
	defer mdb.Close()
	menv := material.NewEnv(mdb)
	mserver = httptest.NewServer(menv.Handlers())

	udb, err := sql.Open("sqlite", "../databases/Userdb/user.db")
	if err != nil {
		panic("No database")
	}
	defer udb.Close()
	uenv := handler.NewEnv(udb, "M+!4ySj_|RuuQHj2!n<Dhx*5+H&L|A~o")
	umux := http.NewServeMux()
	umux.Handle("/", uenv.Handlers())

	m_url, err := url.Parse(mserver.URL)
	if err != nil {
		panic("Server url invalid?")
	}

	// Make proxy for material db
	mat_proxy := httputil.NewSingleHostReverseProxy(m_url)
	umux.Handle("/material/", http.StripPrefix("/material", middleware.Auth(mat_proxy, []byte(uenv.Secret), &uenv, "")))

	userver = httptest.NewServer(umux)

	m.Run()

	mserver.Close()
	userver.Close()
}

// TODO:: Make trigger for when no more material to not allow checkouts
func makePostRequest(jdata []byte, token, route string) (*http.Response, error) {
	req, err := http.NewRequest("POST", userver.URL+route, bytes.NewReader(jdata))
	if err != nil {
		return nil, err
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", token)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	return resp, nil
}

func TestAdminSuite(t *testing.T) {
	token := testAdminSignup(t)
	testAdminAddMaterial(t, token)
	testCheckout(t, token)
}
