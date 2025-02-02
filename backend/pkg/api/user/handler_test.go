package handler

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	_ "modernc.org/sqlite"
)

func TestGetUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	e := NewEnv(db, "")

	ts := httptest.NewServer(http.HandlerFunc(e.createUser))
	defer ts.Close()

	insertData := `{"username": "testuser", "password": "testpass", "email": "test@example.com", "phone": "1234567890"}`
	insertResp, err := http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(insertData))
	if err != nil {
		t.Fatalf("Failed to insert user: %v", err)
	}
	defer insertResp.Body.Close()

	if insertResp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to insert user: expected status code %d, got %d", http.StatusOK, insertResp.StatusCode)
	}

	var user struct {
		ID int `json:"id"`
	}
	err = json.NewDecoder(insertResp.Body).Decode(&user)
	if err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	userID := user.ID

	ts2 := httptest.NewServer(http.HandlerFunc(e.getUser))
	defer ts.Close()

	resp, err := http.Get(ts2.URL + "/user/search?id=" + fmt.Sprint(userID))
	if err != nil {
		t.Fatalf("Failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	username := "testuser"
	_, err = db.Exec("DELETE FROM users WHERE username = ?", username)
	if err != nil {
		t.Fatalf("Failed to delete user during cleanup: %v", err)
	}
}

func TestGetUsers(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	e := NewEnv(db, "")
	ts := httptest.NewServer(http.HandlerFunc(e.getUsers))
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/user/all")
	if err != nil {
		t.Fatalf("Failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}
}

func TestSignUp(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	e := NewEnv(db, "")
	ts := httptest.NewServer(http.HandlerFunc(e.SignUp))
	defer ts.Close()

	userData := `{"username": "testuser", "password": "testpass", "email": "testuser@example.com", "phone": "098897800"}`
	resp, err := http.Post(ts.URL+"/user/signup", "application/json", strings.NewReader(userData))
	if err != nil {
		t.Fatalf("Failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	username := "testuser"
	_, err = db.Exec("DELETE FROM users WHERE username = ?", username)
	if err != nil {
		t.Fatalf("Failed to delete user during cleanup: %v", err)
	}
}

func TestCreateUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	e := NewEnv(db, "")

	ts := httptest.NewServer(http.HandlerFunc(e.createUser))
	defer ts.Close()

	userData := `{"username": "testuser2", "password": "testpass2", "email": "test2@example.com", "phone": "23876543"}`
	resp, err := http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(userData))
	if err != nil {
		t.Fatalf("Failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	username := "testuser2"
	_, err = db.Exec("DELETE FROM users WHERE username = ?", username)
	if err != nil {
		t.Fatalf("Failed to delete user during cleanup: %v", err)
	}
}

func TestUpdateUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	e := NewEnv(db, "")

	// Create a test server
	ts := httptest.NewServer(http.HandlerFunc(e.createUser))
	defer ts.Close()

	insertData := `{"username": "testuser", "password": "testpass", "email": "test@example.com", "phone": "1234567890"}`
	insertResp, err := http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(insertData))
	if err != nil {
		t.Fatalf("Failed to insert user: %v", err)
	}
	defer insertResp.Body.Close()

	if insertResp.StatusCode != http.StatusOK {
		t.Fatalf("Failed to insert user: expected status code %d, got %d", http.StatusOK, insertResp.StatusCode)
	}

	var user struct {
		ID int `json:"id"`
	}
	err = json.NewDecoder(insertResp.Body).Decode(&user)
	if err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}
	userID := user.ID

	ts2 := httptest.NewServer(http.HandlerFunc(e.updateUser))
	defer ts.Close()

	updateData := fmt.Sprintf(`{"id": %d, "username": "updateduser", "password": "updatedpass", "email": "updated@example.com", "phone": "876543675"}`, userID)
	req, err := http.NewRequest("PUT", ts2.URL+"/user/update", strings.NewReader(updateData))
	if err != nil {
		t.Fatalf("Failed to create PUT request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to make PUT request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	username := "updateduser"
	_, err = db.Exec("DELETE FROM users WHERE username = ?", username)
	if err != nil {
		t.Fatalf("Failed to delete user during cleanup: %v", err)
	}
}

func TestDeleteUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()

	e := NewEnv(db, "")

	ts := httptest.NewServer(http.HandlerFunc(e.deleteUser))
	defer ts.Close()

	req, err := http.NewRequest("DELETE", ts.URL+"/user/delete?id=1", nil)
	if err != nil {
		t.Fatalf("Failed to create DELETE request: %v", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatalf("Failed to make DELETE request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}
}
