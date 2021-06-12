DROP TABLE IF EXISTS reports, documents, pages;

CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  title CHAR(255)
);

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) NOT NULL,
  name varchar(255) NOT NULL,
  filetype INTEGER NOT NULL
);

CREATE TABLE pages (
  id SERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) NOT NULL,
  body TEXT,
  footnote TEXT
);