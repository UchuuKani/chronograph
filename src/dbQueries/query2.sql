-- need to join reports with documents on report.id = document.report_id, and (inner? or left) join (to avoid listing reports that don't have pages) this 
-- on pages on document.id = pages.document_id - then group by report.title and sum()

-- Write a SQL query which returns a list of report titles and the total number of pages in the report. reports which do not have pages may be ignored.
SELECT reports.title, COUNT(*)
  FROM reports
  JOIN documents
    ON reports.id = documents.report_id
    JOIN pages 
      ON documents.id = pages.document_id
        GROUP BY reports.title;