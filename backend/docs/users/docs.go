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
                "description": "Pulls user login information and authenticates the user",
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
                            "$ref": "#/definitions/auth.Token"
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
                        "description": "Invalid id",
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
                            "$ref": "#/definitions/auth.Token"
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
                            "type": "object",
                            "additionalProperties": true
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
        "auth.Token": {
            "type": "object",
            "properties": {
                "token": {
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
        "userdb.AddUserParams": {
            "type": "object",
            "properties": {
                "company": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "email": {
                    "type": "string"
                },
                "firstname": {
                    "$ref": "#/definitions/sql.NullString"
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
                "site": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "username": {
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
        "userdb.User": {
            "type": "object",
            "properties": {
                "company": {
                    "$ref": "#/definitions/sql.NullString"
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
                "site": {
                    "$ref": "#/definitions/sql.NullString"
                },
                "username": {
                    "type": "string"
                }
            }
        }
    },
    "externalDocs": {
        "description": "OpenAPI",
        "url": "https://swagger.io/resources/open-api/"
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
