# Build in Golang container
FROM golang:1.24.1-alpine3.21 AS build

# Copy source main and dependencies
COPY ./main/material_api/main.go /api/main.go
COPY ./pkg /api/pkg
COPY ./docs/material /api/docs/material
COPY ./databases/Materialdb /api/databases/Materialdb
COPY ./scripts/csv_to_material/ /api/scripts/
COPY ./go.mod /api/go.mod

WORKDIR /api

## Get foreign packages and build tools
RUN go mod tidy && \
  go install github.com/swaggo/swag/cmd/swag@latest && \
  go install github.com/sqlc-dev/sqlc/cmd/sqlc@v1.27.0 && \
  go install github.com/pressly/goose/v3/cmd/goose@latest
# && \
#apt-get install -y --no-install-recommends sqlite3 libsqlite3-dev


#setup database
WORKDIR /api/databases/Materialdb

#goose
RUN goose down-to 0 && \
  goose up && \
  sqlc generate

WORKDIR /api

# Run the scripts and generate docs
RUN go run ./scripts/main.go scripts/materials.csv && \
  swag init -pdl 3 -o /docs/material/

# compile app
RUN go build -o main

#Seccond phase
FROM alpine:3.21.3

## Move final binary to small image
COPY --from=build /api/main /api/main
COPY --from=build /api/databases/Materialdb/materials.db /api/materials.db
WORKDIR /api

CMD [ "./main" ]

