DROP TABLE IF EXISTS reports, documents, pages;
-- assuming titles will not exceed specified length
CREATE TABLE reports (
  id INTEGER PRIMARY KEY,
  title CHAR(255)
);

-- assuming names and filetypes will not excees specified lengths
CREATE TABLE documents (
  id INTEGER PRIMARY KEY,
  report_id INTEGER REFERENCES reports(id) NOT NULL,
  name CHAR(255) NOT NULL,
  filetype CHAR(255) NOT NULL
);

CREATE TABLE pages (
  id INTEGER PRIMARY KEY,
  document_id INTEGER REFERENCES documents(id) NOT NULL,
  body TEXT,
  footnote TEXT
);

-- create reports
INSERT INTO reports (id, title) VALUES (4, 'Sample Report');
INSERT INTO reports (id, title) VALUES (21, 'Portfolio Summary 2020');

-- create documents
INSERT INTO documents (id, report_id, name, filetype) VALUES (8, 4, 'Sample Document', 'txt');
INSERT INTO documents (id, report_id, name, filetype) VALUES (34, 21, 'Quarterly Report', 'pdf');
INSERT INTO documents (id, report_id, name, filetype) VALUES (87, 21, 'Performance Summary', 'pdf');

-- create pages
INSERT INTO pages (id, document_id, body) VALUES (19, 34, 'Lorem ipsum...');
INSERT INTO pages (id, document_id, body, footnote) VALUES (72, 87, 'Ut aliquet...', 'Aliquam erat...');
INSERT INTO pages (id, document_id, body) VALUES (205, 34, 'Donec a dui et...');