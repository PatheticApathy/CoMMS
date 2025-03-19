// Package users Code generated by swaggo/swag. DO NOT EDIT
package users

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "termsOfService": "http://swagger.io/terms/",
        "contact": {
            "name": "Comms group",
            "url": "http://github.com/PatheticApathy/CoMMS"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/company/create": {
            "post": {
                "description": "Adds company to the database and assigns the user as a company admin",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "companies"
                ],
                "summary": "post company to database",
                "parameters": [
                    {
                        "description": "Format of add company request",
                        "name": "company",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/userdb.AddCompanyParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "company",
                        "schema": {
                            "$ref": "#/definitions/userdb.Company"
                        }
                    },
                    "400": {
                        "description": "Invalid input",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Failed to create company",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/sites/add": {
            "post": {
                "description": "Adds job_site to the database using valid json structure",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "sites"
                ],
                "summary": "post job_site to database",
                "parameters": [
                    {
                        "description": "Format of add jobsite request",
                        "name": "jobsite",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/userdb.AddJobSiteParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "jobsite",
                        "schema": {
                            "$ref": "#/definitions/userdb.JobSite"
                        }
                    },
                    "400": {
                        "description": "bad request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/sites/all": {
            "get": {
                "description": "Get all jobsites",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "sites"
                ],
                "summary": "fetches all job_sites",
                "responses": {
                    "200": {
                        "description": "job site",
                        "schema": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/userdb.JobSite"
                            }
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/sites/search": {
            "get": {
                "description": "Gets jobsites using id(may add more parameters later)",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "sites"
                ],
                "summary": "fetches job_site based on given paremeters",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "jobsite's identification number",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "job site",
                        "schema": {
                            "$ref": "#/definitions/userdb.JobSite"
                        }
                    },
                    "400": {
                        "description": "bad request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/all": {
            "get": {
                "description": "Gets users",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "fetches all users",
                "responses": {
                    "200": {
                        "description": "users",
                        "schema": {
                            "$ref": "#/definitions/userdb.User"
                        }
                    },
                    "500": {
                        "description": "Faliled to get users",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/create": {
            "post": {
                "security": [
                    {
                        "identity": []
                    }
                ],
                "description": "Adds user to the database using valid json structure",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "post user to database",
                "parameters": [
                    {
                        "description": "Format of add user request",
                        "name": "users",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/userdb.AddUserParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "users",
                        "schema": {
                            "$ref": "#/definitions/userdb.User"
                        }
                    },
                    "400": {
                        "description": "Invalid input",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Failed to create user",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/decrypt": {
            "post": {
                "description": "Decrypt user login token",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Decrypts token",
                "parameters": [
                    {
                        "description": "Format of login user request",
                        "name": "users",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "string"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User login data token",
                        "schema": {
                            "$ref": "#/definitions/auth.Identity"
                        }
                    },
                    "400": {
                        "description": "Invalid request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/delete": {
            "delete": {
                "description": "Deletes user using id(may add more parameters later)",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "removes user based on given paremeters",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "user's identification number",
                        "name": "id",
                        "in": "query",
                        "required": true
                    }
                ],
                "responses": {
                    "200": {
                        "description": "users",
                        "schema": {
                            "$ref": "#/definitions/userdb.User"
                        }
                    },
                    "400": {
                        "description": "Invalid user ID",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Failed to delete user",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/loggout": {
            "post": {
                "description": "Replaces login cookie with an empty one that deletes itself instantly",
                "tags": [
                    "users"
                ],
                "summary": "Removes authenticated user information",
                "responses": {
                    "200": {
                        "description": "Success",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Invalid input",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/login": {
            "post": {
                "description": "Pulls user login information and authenticates the user\nThe id can be left blank",
                "consumes": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "Authenticate user information",
                "parameters": [
                    {
                        "description": "Format of login user request",
                        "name": "users",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/auth.UnEncrypted"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User login token",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Invalid input",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/search": {
            "get": {
                "description": "Gets user using id(may add more parameters later)",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "fetches user based on given paremeters",
                "parameters": [
                    {
                        "type": "integer",
                        "description": "user's identification number",
                        "name": "id",
                        "in": "query"
                    },
                    {
                        "type": "string",
                        "description": "user's username",
                        "name": "username",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "users",
                        "schema": {
                            "$ref": "#/definitions/userdb.User"
                        }
                    },
                    "400": {
                        "description": "Bad request",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/signup": {
            "post": {
                "description": "Adds user to the database using valid json structure",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "post user to database",
                "parameters": [
                    {
                        "description": "Format of signup user request",
                        "name": "users",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/userdb.SignUpParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "User login token",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "400": {
                        "description": "Invalid input",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Failed to signup user",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        "/user/update": {
            "put": {
                "description": "Updates user using id(may add more parameters later)",
                "produces": [
                    "application/json"
                ],
                "tags": [
                    "users"
                ],
                "summary": "updates user based on given parameters",
                "parameters": [
                    {
                        "description": "Format of update user request",
                        "name": "users",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/userdb.UpdateUserParams"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "users",
                        "schema": {
                            "$ref": "#/definitions/userdb.User"
                        }
                    },
                    "400": {
                        "description": "Invalid input",
                        "schema": {
                            "type": "string"
                        }
                    },
                    "500": {
                        "description": "Failed to update user",
                        "schema": {
                            "type": "string"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "auth.Identity": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "password": {
                    "type": "string"
                },
                "role": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "auth.UnEncrypted": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "integer"
                },
                "password": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "sql.NullFloat64": {
            "type": "object",
            "properties": {
                "float64": {
                    "type": "number"
                },
                "valid": {
                    "description": "Valid is true if Float64 is not NULL",
                    "type": "boolean"
                }
            }
        },
        "sql.NullInt64": {
            "type": "object",
            "properties": {
                "int64": {
                    "type": "integer"
                },
                "valid": {
                    "description": "Valid is true if Int64 is not NULL",
                    "type": "boolean"
                }
            }
        },
        "sql.NullString": {
            "type": "object",
            "properties": {
                "string": {
                    "type": "string"
                },
                "valid": {
                    "description": "Valid is true if String is not NULL",
                    "type": "boolean"
                }
            }
        },
        "userdb.AddCompanyParams": {
            "type": "object",
            "properties": {
                "addr": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "location_lat": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "location_lng": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "userdb.AddJobSiteParams": {
            "type": "object",
            "properties": {
                "addr": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "company_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "location_lat": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "location_lng": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "userdb.AddUserParams": {
            "type": "object",
            "properties": {
                "company_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "email": {
                    "type": "string"
                },
                "firstname": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "jobsite_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "lastname": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "password": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "profilepicture": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "role": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "userdb.Company": {
            "type": "object",
            "properties": {
                "addr": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "id": {
                    "type": "integer"
                },
                "location_lat": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "location_lng": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "userdb.JobSite": {
            "type": "object",
            "properties": {
                "addr": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "company_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "id": {
                    "type": "integer"
                },
                "location_lat": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "location_lng": {
                    "$ref": "#/definitions/sql.NullFloat64"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "userdb.SignUpParams": {
            "type": "object",
            "properties": {
                "email": {
                    "type": "string"
                },
                "password": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "username": {
                    "type": "string"
                }
            }
        },
        "userdb.UpdateUserParams": {
            "type": "object",
            "properties": {
                "company_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "email": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "firstname": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "id": {
                    "type": "integer"
                },
                "jobsite_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "lastname": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "password": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "phone": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "profilepicture": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "role": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "username": {
                    "$ref": "#/definitions/sql.NullString"
                }
            }
        },
        "userdb.User": {
            "type": "object",
            "properties": {
                "company_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "email": {
                    "type": "string"
                },
                "firstname": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "id": {
                    "type": "integer"
                },
                "jobsite_id": {
                    "$ref": "#/definitions/sql.NullInt64"
                },
                "lastname": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "password": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "profilepicture": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "role": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    },
    "securityDefinitions": {
        "identity": {
            "description": "gives read and write access to api",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "1.0",
	Host:             "localhost:8082",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "User API",
	Description:      "This is the api for dealing with users",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
