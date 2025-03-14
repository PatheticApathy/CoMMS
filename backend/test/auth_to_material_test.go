package material_test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/http/httputil"
	"net/url"
	"strconv"
	"testing"

	"github.com/PatheticApathy/CoMMS/pkg/api/material"
	handler "github.com/PatheticApathy/CoMMS/pkg/api/user"
	"github.com/PatheticApathy/CoMMS/pkg/auth"
	"github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
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
	umux.Handle("/", uenv.Handler())

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

// Admins should be able to add materials to jobs sites wihtin their company
func TestAdminSignupToAddMaterial(t *testing.T) {
	login := auth.UnEncrypted{
		Username: "username",
		Password: "password",
	}

	jdata, err := json.Marshal(login)
	if err != nil {
		t.Fatalf("Could not marshall json: %e", err)
		return
	}

	// signup
	client := &http.Client{}
	resp, err := client.Post(userver.URL+"/user/signup", "application/json", bytes.NewReader(jdata))
	if err != nil {
		t.Fatal(err)
		return
	}

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /user/signup", resp.Status)
		return
	}
	defer resp.Body.Close()

	var token string
	err = json.NewDecoder(resp.Body).Decode(&token)
	if err != nil {
		t.Fatal(err)
	}

	// delete account so we can run test again later(this is defered till after the test ends)
	defer func() {
		temp_user, err := auth.VerifyToken(token, []byte("M+!4ySj_|RuuQHj2!n<Dhx*5+H&L|A~o"))
		if err != nil {
			t.Fatal(err)
			return
		}
		id := strconv.Itoa(int(temp_user.ID))

		delete_req, err := http.NewRequest("DELETE", userver.URL+"/user/delete?id="+id, nil)
		if err != nil {
			t.Fatal(err)
			return
		}

		resp, err := client.Do(delete_req)
		if err != nil {
			t.Fatal(err)
		}
		if resp.Status != "200 OK" {
			t.Fatalf("Error deleting user with status %s", resp.Status)
		}
		resp.Body.Close()
	}()

	t.Logf("Authorization token is %s", token)

	// add material
	add := materialdb.AddMaterialParams{
		Name:        sql.NullString{String: "Blocks", Valid: true},
		Type:        sql.NullString{String: "Wood", Valid: true},
		Status:      "In Stock",
		Quantity:    80,
		Unit:        "blocks",
		LocationLat: sql.NullFloat64{Float64: 0, Valid: false},
		LocationLng: sql.NullFloat64{Float64: 0, Valid: false},
		JobSite:     sql.NullInt64{Int64: 0, Valid: false},
	}

	jdata, err = json.Marshal(add)
	if err != nil {
		t.Fatalf("Could not marshall json: %e", err)
		return
	}

	req, err := http.NewRequest("POST", userver.URL+"/material/material/add", bytes.NewReader(jdata))
	if err != nil {
		t.Fatalf("The token failed when adding material with error %e", err)
		return
	}
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", token)
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("The token failed when adding material with error %e", err)
		return
	}

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /material/material/add", resp.Status)
		return
	}
	defer resp.Body.Close()
}
