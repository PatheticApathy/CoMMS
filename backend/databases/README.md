# Database

This is the file containing everything related to the database code maintenance with the exception of the go code that is used closer to the server.

To setup everything fast, simply run `goose up` which will create the database and populate it with all updates so far.

## /migrations

This is where migrations created using the [goose](https://github.com/pressly/goose).

### Create migrations

Run `goose create <name>.sql sql` to create a migration.

### Up and Down

Goose files have comments such as `-- +goose up` to define a update and each migration file must also include a down section(with exception) that will undo the update.
<br>

Ex.

```sql
-- +goose Up
CREATE TABLE post (
    id int NOT NULL,
    title text,
    body text,
    PRIMARY KEY(id)
);

-- +goose Down
DROP TABLE post;
```

### Applying Updates

`goose up` upgrades db.
`goose down` downgrades db by one update.
Other commands can be found on the [goose README](https://github.com/pressly/goose).

## sqlc.yaml

sqlc.yaml is the config file for sqlc.
Sqlc generates go code from the database schema and query.
Example can be found [here](../configs/sqlc-template.yaml).

## .env

Contains environment variables for goose migrations

Must contain
<br>

```Bash
GOOSE_DRIVER=sqlite
GOOSE_DBSTRING=./<database>.db
GOOSE_MIGRATION_DIR=./migrations
```

Example can also be found [here](../configs/.env-template).
