package handler

import (
	"database/sql"
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
	e := NewEnv(db)

	ts := httptest.NewServer(http.HandlerFunc(e.getUser))
	defer ts.Close()

	// Test case: Valid user ID
	resp, err := http.Get(ts.URL + "/user/search?id=1")
	if err != nil {
		t.Fatalf("Failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	// Test case: Invalid user ID
	resp, err = http.Get(ts.URL + "/user/search?id=invalid")
	if err != nil {
		t.Fatalf("Failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, resp.StatusCode)
	}
}

func TestGetUsers(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	e := NewEnv(db)
	// Create a test server
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
	e := NewEnv(db)
	// Create a test server
	ts := httptest.NewServer(http.HandlerFunc(e.SignUp))
	defer ts.Close()

	// Test case: Valid user data
	userData := `{"username": "testuser", "password": "testpass", "email": "test@example.com"}`
	resp, err := http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(userData))
	if err != nil {
		t.Fatalf("Failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	// Test case: Invalid user data
	invalidUserData := `{"username": "", "password": "", "email": ""}`
	resp, err = http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(invalidUserData))
	if err != nil {
		t.Fatalf("Failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, resp.StatusCode)
	}
}

func TestCreateUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	e := NewEnv(db)
	// Create a test server
	ts := httptest.NewServer(http.HandlerFunc(e.createUser))
	defer ts.Close()

	// Test case: Valid user data
	userData := `{"username": "testuser", "password": "testpass", "email": "test@example.com"}`
	resp, err := http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(userData))
	if err != nil {
		t.Fatalf("Failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected status code %d, got %d", http.StatusOK, resp.StatusCode)
	}

	// Test case: Invalid user data
	invalidUserData := `{"username": "", "password": "", "email": ""}`
	resp, err = http.Post(ts.URL+"/user/create", "application/json", strings.NewReader(invalidUserData))
	if err != nil {
		t.Fatalf("Failed to make POST request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, resp.StatusCode)
	}
}

func TestUpdateUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	e := NewEnv(db)
	// Create a test server
	ts := httptest.NewServer(http.HandlerFunc(e.updateUser))
	defer ts.Close()

	// Test case: Valid user data
	userData := `{"id": 1, "username": "updateduser", "password": "updatedpass", "email": "updated@example.com"}`
	req, err := http.NewRequest("PUT", ts.URL+"/user/update", strings.NewReader(userData))
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

	// Test case: Invalid user data
	invalidUserData := `{"id": 1, "username": "", "password": "", "email": ""}`
	req, err = http.NewRequest("PUT", ts.URL+"/user/update", strings.NewReader(invalidUserData))
	if err != nil {
		t.Fatalf("Failed to create PUT request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("Failed to make PUT request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, resp.StatusCode)
	}
}

func TestDeleteUser(t *testing.T) {
	db, err := sql.Open("sqlite", "../../../databases/Userdb/user.db")
	if err != nil {
		t.Fatal(err)
	}
	defer db.Close()
	e := NewEnv(db)
	// Create a test server
	ts := httptest.NewServer(http.HandlerFunc(e.deleteUser))
	defer ts.Close()

	// Test case: Valid user ID
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

	// Test case: Invalid user ID
	req, err = http.NewRequest("DELETE", ts.URL+"/user/delete?id=invalid", nil)
	if err != nil {
		t.Fatalf("Failed to create DELETE request: %v", err)
	}

	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("Failed to make DELETE request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusBadRequest {
		t.Errorf("Expected status code %d, got %d", http.StatusBadRequest, resp.StatusCode)
	}
}
