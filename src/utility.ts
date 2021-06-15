import { IStore, IReport, IDocument, IPage } from "./store";

export function getReports(dataStore: IStore): { [reportId: number]: IReport } {
  if (dataStore.report) {
    return dataStore.report;
  } else {
    throw new Error("Unable to access report data");
  }
}

export function getDocuments(dataStore: IStore): {
  [documentId: number]: IDocument;
} {
  if (dataStore.document) {
    return dataStore.document;
  } else {
    throw new Error("Unable to access document data");
  }
}

export function getPages(dataStore: IStore): {
  [pageId: number]: IPage;
} {
  if (dataStore.page) {
    return dataStore.page;
  } else {
    throw new Error("Unable to access page data");
  }
}

export function getReportById(reportId: number, dataStore: IStore): IReport {
  const report = dataStore.report[reportId];

  if (report !== undefined) {
    return report;
  } else {
    throw new Error("No report found with ID " + reportId);
  }
}

export function getDocumentById(
  documentId: number,
  dataStore: IStore
): IDocument {
  const document = dataStore.document[documentId];

  if (document !== undefined) {
    return document;
  } else {
    throw new Error("No document found with ID " + documentId);
  }
}

export function getPageById(pageId: number, dataStore: IStore): IPage {
  const page = dataStore.page[pageId];

  if (page !== undefined) {
    return page;
  } else {
    throw new Error("No page found with ID " + pageId);
  }
}
