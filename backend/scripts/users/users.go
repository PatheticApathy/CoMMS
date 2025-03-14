package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"

	user_db "github.com/PatheticApathy/CoMMS/pkg/databases/userdb"

	_ "modernc.org/sqlite"
)

func main() {

	// connect to db
	db, err := sql.Open("sqlite", "./databases/Userdb/user.db")
	if err != nil {
		fmt.Println(err)
	}
	defer db.Close()

	queries := user_db.New(db)

	// Create a new user
	AddUserParams := user_db.AddUserParams{
		Username: "johndoe",
		Password: "password",
		Firstname: sql.NullString{
			String: "John",
			Valid:  true,
		},
		Lastname: sql.NullString{
			String: "Doe",
			Valid:  true,
		},
		CompanyID: sql.NullInt64{
			Int64: 1,
			Valid: true,
		},
		JobsiteID: sql.NullInt64{
			Int64: 1,
			Valid: true,
		},
		Role: sql.NullString{
			String: "admin",
			Valid:  true,
		},
		Email: "test@gmail.com",
		Phone: "1234567890",
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

	// // Update a user
	// updateParams := user_db.UpdateUserParams{
	// 	ID:       userID,
	// 	Username: "john_doe_updated",
	// 	Password: "new_password",
	// 	Firstname: sql.NullString{
	// 		String: "John_updated",
	// 		Valid:  true,
	// 	},
	// 	Lastname: sql.NullString{
	// 		String: "Doe_updated",
	// 		Valid:  true,
	// 	},
	// 	Company: sql.NullString{
	// 		String: "Acme Inc",
	// 		Valid:  true,
	// 	},
	// 	Site: sql.NullString{
	// 		String: "acme.com",
	// 		Valid:  true,
	// 	},
	// 	Role: sql.NullString{
	// 		String: "admin",
	// 		Valid:  true,
	// 	},
	// 	Email: "test@gmail.com",
	// 	Phone: "1234567890",
	// }
	// updatedUser, err := queries.UpdateUser(context.Background(), updateParams)
	// if err != nil {
	// 	log.Fatal(err)
	// }
	// fmt.Printf("Updated user: %+v\n", updatedUser)

	// Delete a user
	err = queries.DeleteUser(context.Background(), userID)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Deleted user")
}
