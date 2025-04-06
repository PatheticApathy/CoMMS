# Build in Golang container
FROM golang:1.24.1-alpine3.21 AS build

# Copy source main and dependencies
COPY . /api
WORKDIR /api

## Get foreign packages and build tools
RUN go mod tidy && \
  go install github.com/swaggo/swag/cmd/swag@latest && \
  go install github.com/sqlc-dev/sqlc/cmd/sqlc@v1.27.0 && \
  go install github.com/pressly/goose/v3/cmd/goose@latest


#setup database
WORKDIR /api/databases/Materialdb

#goose
RUN goose down-to 0 && \
  goose up && \
  sqlc generate

WORKDIR /api

# Run the scripts and generate docs
RUN go run ./scripts/csv_to_material/main.go scripts/csv_to_material/materials.csv


WORKDIR /api/main/material_api

# create docs compile app
RUN swag init -pdl 3 -o ./docs/material/ &&\
  go build -o main

#Seccond phase
FROM alpine:3.21.3

## Move final binary to small image
COPY --from=build /api/main/material_api/main /api/main
COPY --from=build /api/databases/Materialdb/materials.db /api/db/materials.db
VOLUME /api/db
WORKDIR /api

CMD [ "./main" ]

