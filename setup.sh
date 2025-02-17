#Find Dependencies
DEPENDENCIES=("npm" "go")

for dep in ${DEPENDENCIES[@]}; do
  if [ -f "$(command -v $dep)" ]; then
    echo "Found $dep"
  else
    echo "No $dep binary found"
    exit 1
  fi
done

GO="$(go env GOPATH)/bin"
NPM="$(command -v npm)"

if [[ "$OSTYPE" == "linux-gnu" ]]; then
  echo "Os is Linux"

  SQLC="$GO/sqlc"
  GOOSE="$GO/goose"
  SWAG="$GO/swag"

elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
  echo "OS is Windows"
  SQLC="$GO/sqlc.exe"
  GOOSE="$GO/goose.exe"
  SWAG="$GO/swag.exe"

else
  echo "Unsupported OS: $OSTYPE"
fi

#Check if go binaries are installed
DEPENDENCIES=("$GOOSE" "$SQLC" "$SWAG")

for dep in ${DEPENDENCIES[@]}; do
  if [ -f "$(command -v $dep)" ]; then
    echo "Found $dep"
  else
    echo "No $dep binary found"
  fi
done

OG=$PWD

##########setup frontend#################
cd ./frontend/
npm install
cd $OG

###########setup backend#################
cd ./backend
go mod tidy
cd $OG

#setup material db
cd ./backend/databases/Materialdb/
$GOOSE down
$GOOSE up
$SQLC generate
cd ./../../
go run scripts/csv_to_material/main.go scripts/csv_to_material/materials.csv
cd $OG

#setup userdb
cd ./backend/databases/Userdb/
$GOOSE down
$GOOSE up
$SQLC generate
cd ./../../
go run scripts/csv_to_users/main.go scripts/csv_to_users/users.csv
cd $OG

#setup swagger material docs
cd ./backend/main/material_api/
$SWAG init -pdl 3 -o ../../docs/material/
cd $OG

#setup swagger user docs
cd ./backend/main/user_api/
$SWAG init -pdl 3 -o ../../docs/users/
cd $OG
