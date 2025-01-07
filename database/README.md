# Database

This is the file containing everything related to the database code maintenance with the exception of to go code that is used closer to the server.

You should also create a file called `materials.db` in this directory.

## /migrations

This is where migrations created using the [goose](https://github.com/pressly/goose).

### Create migrations

Run `goose create <name> sql` to create a migration.

### Up and Down

Goose files have comments such as `--+goose up` to define a update and each migration file must also include a down section(with exception) that will undo the update.
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

`goose up` upgrades updates.
`goose down` downgrades db.
Other commands can be found on the [goose README](https://github.com/pressly/goose).

## sqlc.yaml

sqlc.yaml is the config file for sqlc.
Sqlc generates go code from the database schema and query.

## .env

Conatins environment variables for goose

Must contain
<br>

```Bash
GOOSE_DRIVER=sqlite
GOOSE_DBSTRING=./materials.db
GOOSE_MIGRATION_DIR=./migrations
```
