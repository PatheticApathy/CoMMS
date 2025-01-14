package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	"Userdb/user_db"

	_ "modernc.org/sqlite"
)

func main() {
	// Connect to the SQLite database
	conn, err := sql.Open("sqlite", "user.db")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	// Create a new Queries instance
	queries := user_db.New(conn)

	// Create a new user
	AddUserParams := user_db.AddUserParams{
		Username: "johndoe",
		Password: "password",
		Name:     "John Doe",
		Company:  "Acme Inc",
		Site:     "acme.com",
		Role:     "admin",
	}
	user, err := queries.AddUser(context.Background(), AddUserParams)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Created user: %+v\n", user)

	// Get a user by ID
	userID := user.ID
	GetUser, err := queries.GetUser(context.Background(), userID)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Fetched user: %+v\n", GetUser)

	// List all users
	users, err := queries.GetAllUsers(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("List of users: %+v\n", users)

	// Example: Update a user
	updateParams := user_db.UpdateUserParams{
		ID:       userID,
		Username: "john_doe_updated",
		Password: "new_password",
		Name:     "John Doe Updated",
		Company:  "Acme Inc",
		Site:     "acme.com",
		Role:     "admin",
	}
	updatedUser, err := queries.UpdateUser(context.Background(), updateParams)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Updated user: %+v\n", updatedUser)

	// Delete a user
	//err = queries.DeleteUser(context.Background(), userID)
	//if err != nil {
	//	log.Fatal(err)
	//}
	//fmt.Println("Deleted user")
}
