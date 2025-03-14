package test

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"testing"

	"github.com/PatheticApathy/CoMMS/pkg/auth"
	"github.com/PatheticApathy/CoMMS/pkg/databases/materialdb"
	_ "modernc.org/sqlite"
)

// creates admin  token for next set of admin test
func testAdminSignup(t *testing.T) string {
	login := auth.UnEncrypted{
		Username: "username",
		Password: "password",
	}

	jdata, err := json.Marshal(login)
	if err != nil {
		t.Fatalf("Could not marshall json: %e", err)
		return ""
	}

	// signup
	client := &http.Client{}
	resp, err := client.Post(userver.URL+"/user/signup", "application/json", bytes.NewReader(jdata))
	if err != nil {
		t.Fatal(err)
		return ""
	}

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /user/signup", resp.Status)
		return ""
	}
	defer resp.Body.Close()

	var token string
	err = json.NewDecoder(resp.Body).Decode(&token)
	if err != nil {
		t.Fatal(err)
	}

	// delete account so we can run test again later(this is defered till after the test ends)
	t.Cleanup(func() {
		temp_user, err := auth.VerifyToken(token, []byte("M+!4ySj_|RuuQHj2!n<Dhx*5+H&L|A~o"))
		if err != nil {
			t.Fatal(err)
		}
		id := strconv.Itoa(int(temp_user.ID))

		delete_req, err := http.NewRequest("DELETE", userver.URL+"/user/delete?id="+id, nil)
		if err != nil {
			t.Fatal(err)
		}

		resp, err := client.Do(delete_req)
		if err != nil {
			t.Fatal(err)
		}
		if resp.Status != "200 OK" {
			t.Fatalf("Error deleting user with status %s", resp.Status)
		}
		resp.Body.Close()
	})

	t.Logf("Authorization token is %s", token)
	return token
}

// Admins should be able to add materials to jobs sites wihtin their company
func testAdminAddMaterial(t *testing.T, token string) {
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

	jdata, err := json.Marshal(add)
	if err != nil {
		t.Fatalf("Could not marshall json: %e", err)
		return
	}

	resp, err := makePostRequest(jdata, token, "/material/material/add")
	if err != nil {
		t.Fatalf("Failed to send add material request with error %e", err)
	}
	defer resp.Body.Close()

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /material/material/add", resp.Status)
		return
	}
}

func testCheckout(t *testing.T, token string) {
	identity, err := auth.VerifyToken(token, []byte("M+!4ySj_|RuuQHj2!n<Dhx*5+H&L|A~o"))
	if err != nil {
		t.Fatalf("Impossible token error reached: %e", err)
		return
	}

	// Checkout Material
	checkout := materialdb.AddCheckoutLogParams{
		ItemID: 2,
		UserID: identity.ID,
	}

	jdata, err := json.Marshal(checkout)
	if err != nil {
		t.Fatalf("Could not marshall json: %e", err)
		return
	}

	resp, err := makePostRequest(jdata, token, "/material/check/out")
	if err != nil {
		t.Fatalf("Failed to send checkout request with error %e", err)
	}
	defer resp.Body.Close()

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /material/check/out", resp.Status)
		return
	}

	// Checkout Material twice should fail
	resp, err = makePostRequest(jdata, token, "/material/check/out")
	if err != nil {
		t.Fatalf("Failed to send checkout request with error %e", err)
	}
	defer resp.Body.Close()

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /material/check/out", resp.Status)
		return
	}

	// Cannot Checkout Material When empty
	resp, err = makePostRequest(jdata, token, "/material/check/out")
	if err != nil {
		t.Fatalf("Failed to send checkout request with error %e", err)
	}
	defer resp.Body.Close()

	if resp.Status != "200 OK" {
		t.Fatalf("Error got status code %s from /material/check/out", resp.Status)
		return
	}
}

func testCheckIn(t *testing.T, token string) {
	// Checkin Material
	// Checkin Material twice should fail
}
