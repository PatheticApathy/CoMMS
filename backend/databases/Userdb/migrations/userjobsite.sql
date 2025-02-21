-- +goose Up
-- +goose StatementBegin
CREATE TABLE UserJobSite (
  user_id INTEGER,
  jobsite_id INTEGER,
  PRIMARY KEY (user_id, jobsite_id),
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(jobsite_id) REFERENCES JobSites(id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE UserJobSite;
-- +goose StatementEnd