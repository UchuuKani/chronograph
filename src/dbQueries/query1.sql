SELECT id 
  FROM documents
  WHERE NOT EXISTS
    (SELECT  *
     FROM pages
     WHERE pages.document_id = documents.id);