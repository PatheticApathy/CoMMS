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
WORKDIR /api/databases/Userdb

#goose
RUN goose down-to 0 && \
  goose up && \
  sqlc generate

WORKDIR /api

# Run the scripts and generate docs
RUN go run ./scripts/csv_to_users/main.go scripts/csv_to_users/users.csv && \
  go run ./scripts/csv_to_jobsites/main.go scripts/csv_to_jobsites/jobsites.csv && \
  go run ./scripts/csv_to_companies/main.go scripts/csv_to_companies/companies.csv


WORKDIR /api/main/user_api

# gen docs and compile app
RUN  swag init -pdl 3 -o ./docs/users/ &&\
  go build -o main

#Seccond phase
FROM alpine:3.21.3

## Move final binary to small image
COPY --from=build /api/main/user_api/main /api/main
COPY --from=build /api/databases/Userdb/user.db /api/db/user.db
VOLUME /api/db
WORKDIR /api

CMD [ "./main" ]
