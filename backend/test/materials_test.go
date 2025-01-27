package material_test

import (
	"database/sql"
	"fmt"
	"net/http/httptest"
	"testing"

	"github.com/PatheticApathy/CoMMS/pkg/api/material"
	_ "modernc.org/sqlite"
)

var server httptest.Server

func TestMain(m *testing.M) {
	db, err := sql.Open("sqlite", "../databases/Materialdb/materials.db")
	if err != nil {
		panic("No database")
	}
	defer db.Close()
	env := material.NewEnv(db)
	server = *httptest.NewServer(env.Handlers())
	fmt.Println("Test server started")
	server.Start()
	defer server.Close()
	m.Run()
}
