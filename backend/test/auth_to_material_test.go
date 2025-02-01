package material_test

import (
	"database/sql"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/PatheticApathy/CoMMS/pkg/api/material"
	"github.com/PatheticApathy/CoMMS/pkg/api/user"
	_ "modernc.org/sqlite"
)

var server httptest.Server

func TestMain(m *testing.M) {
	mdb, err := sql.Open("sqlite", "../databases/Materialdb/materials.db")
	if err != nil {
		panic("No database")
	}
	defer mdb.Close()
	menv := material.NewEnv(mdb)
  mserver := *httptest.NewServer(menv.Handlers())
	fmt.Println("Test server started")
	mserver.Start()
	defer mserver.Close()

	udb, err := sql.Open("sqlite", "../databases/Materialdb/materials.db")
	if err != nil {
		panic("No database")
	}
	defer udb.Close()
	uenv := material.NewEnv(udb)
  umux := http.NewServeMux()
  umux.Handle("/", uenv.Handlers())


	mat_proxy := httputil.NewSingleHostReverseProxy(mat_host)
	umux.Handle("/material/", http.StripPrefix("/material", mat_proxy))

  umux.HandleFunc(pattern string, handler func(http.ResponseWriter, *http.Request))
  userver := *httptest.NewServer(umux)

	m.Run()
}

//Admins should be able to add materials to jobs sites wihtin their company

//subordinates should be able to adjust the quantity of itmes and be able to  
