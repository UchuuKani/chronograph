function getReports(dataStore) {
  if (dataStore.report) {
    return dataStore.report;
  } else {
    throw new Error("Unable to access report data");
  }
}

function getDocuments(dataStore) {
  if (dataStore.document) {
    return dataStore.document;
  } else {
    throw new Error("Unable to access document data");
  }
}

function getPages(dataStore) {
  if (dataStore.page) {
    return dataStore.page;
  } else {
    throw new Error("Unable to access page data");
  }
}

function getReportById(reportId, dataStore) {
  const report = dataStore.report[reportId];

  if (report !== undefined) {
    return report;
  } else {
    throw new Error("No report found with ID " + reportId);
  }
}

function getDocumentById(documentId, dataStore) {
  const document = dataStore.document[documentId];

  if (document !== undefined) {
    return document;
  } else {
    throw new Error("No document found with ID " + documentId);
  }
}

function getPageById(pageId, dataStore) {
  const page = dataStore.page[pageId];

  if (page !== undefined) {
    return page;
  } else {
    throw new Error("No page found with ID " + pageId);
  }
}

module.exports = {
  getReports,
  getDocuments,
  getPages,
  getReportById,
  getDocumentById,
  getPageById,
};
