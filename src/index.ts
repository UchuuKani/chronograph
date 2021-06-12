import { accessReportData } from "./utility";

export interface IStore {
  document: { [doc_id: number]: IDocument };
  page: { [page_id: number]: IPage };
  report: { [report_id: number]: IReport };
}

interface IDocument {
  id: number;
  report_id: number | null;
  name: string | null;
  filetype: string | null;
}

interface IPage {
  id: number;
  document_id: number | null;
  body: string | null;
  footnote: string | null;
}

export interface IReport {
  id: number;
  title: string | null;
}

const store: IStore = {
  document: {
    8: { id: 8, report_id: 4, name: "Sample Document", filetype: "txt" },
    34: { id: 34, report_id: 21, name: "Quarterly Report", filetype: "pdf" },
    87: { id: 87, report_id: 21, name: "Performance Summary", filetype: "pdf" },
  },
  page: {
    19: { id: 19, document_id: 34, body: "Lorem ipsum...", footnote: null },
    72: {
      id: 72,
      document_id: 87,
      body: "Ut aliquet...",
      footnote: "Aliquam erat...",
    },
    205: {
      id: 205,
      document_id: 34,
      body: "Donec a dui et...",
      footnote: null,
    },
  },
  report: {
    4: { id: 4, title: "Sample Report" },
    21: { id: 21, title: "Portfolio Summary 2020" },
  },
};

// choosing to pass in the data source we would read from in case there are multiple data sources with the same structure as IStore
function determineNumberPagesInReport(
  reportId: number,
  dataStore: IStore
):
  | {
      reportId: number;
      numberPages: number;
    }
  | string {
  // handle case where we are passed a reportId that doesn't exist - should also handle if type of reportId is not a number or cannot be
  // converted from string to number - not as necessary to handle second case in TS?
  const reportData = accessReportData(reportId, dataStore);

  if (typeof reportData === "string") {
    return reportData;
  }
  let documentsMatching: { [documentId: number]: boolean } = {};
  // for each document in the store, find which ones are related to the reportId
  for (let documentId in dataStore.document) {
    if (dataStore.document[documentId].report_id === reportId) {
      documentsMatching[documentId] = true;
    }
  }
  console.log("documents matching", documentsMatching);
  let pagesMatching: number = 0;
  // for each page in the store, find which ones are related to every document we found
  for (let pageId in dataStore.page) {
    if (
      documentsMatching[dataStore?.page?.[pageId]?.document_id] !== undefined
    ) {
      pagesMatching += 1;
    }
  }
  return { reportId, numberPages: pagesMatching };
}

console.log(determineNumberPagesInReport(4, store));
