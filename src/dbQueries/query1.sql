SELECT id 
  FROM documents
  WHERE NOT EXISTS
    (SELECT 1
     FROM pages
     WHERE pages.document_id = documents.id);

SELECT documents.id, pages.id
  FROM documents
  LEFT JOIN pages
    ON (documents.id = pages.document_id)
    WHERE pages.id IS NULL;