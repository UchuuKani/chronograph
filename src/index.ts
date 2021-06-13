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

// iterate through all pages and make object where key is document id, and value is a set or array, whatever, that contains all pages for a document
function compileReportsWithPageCounts() {
  let docToPagesCountMap: { [id: number]: number } = {};
  for (let pageId in store.page) {
    let currPage = store.page[pageId];

    if (docToPagesCountMap[currPage.document_id] === undefined) {
      docToPagesCountMap[currPage.document_id] = 1;
    } else {
      docToPagesCountMap[currPage.document_id] += 1;
    }
  }

  // iterate through all documents and make object where key is documentId and value is number of pages associated with document
  // let docToPagesCount: { [docId: number]: number } = {};
  let reportToDocsMap: {
    [reportId: number]: { [documentId: number]: boolean };
  } = {};
  for (let docId in store.document) {
    let currDoc = store.document[docId];

    // fill out map of report to documents associated with it like: {4: {7: true, 5: true}}
    if (reportToDocsMap[currDoc.report_id] === undefined) {
      reportToDocsMap[currDoc.report_id] = { [currDoc.id]: true };
    } else {
      reportToDocsMap[currDoc.report_id][currDoc.id] = true;
    }

    // // map document id to number of pages associated with document
    // if (docToPagesCountMap[currDoc.id] !== undefined) {
    //   docToPagesCount[currDoc.id] = docToPagesCountMap[currDoc.id];
    // }
  }
  // need map of all reports to each document associated with it, can generate this in above loop through documents

  let reportsPagesCounts: { [reportId: number]: number } = {};
  for (let reportId in store.report) {
    let currReport = store.report[reportId];
    // possible to have a report without documents, or documents without pages?
    if (reportToDocsMap[currReport.id] !== undefined) {
      // initialize the mapping from reportId to pageCount as 0 initially
      reportsPagesCounts[currReport.id] = 0;
      let reportToDocuments = Object.keys(reportToDocsMap[reportId]);

      let pageCount = 0;
      for (let documentId of reportToDocuments) {
        if (docToPagesCountMap[Number(documentId)] !== undefined) {
          pageCount += docToPagesCountMap[Number(documentId)];
        }
        reportsPagesCounts[currReport.id] = pageCount;
      }

      // possible to have a document with no pages according to store data, so need to make sure a document has pages before trying to add its page count
    } else {
      // if there isn't an entry for a report ID in reportToDocsMap, assume there are no documents associated with that report, and thus no pages
      reportsPagesCounts[currReport.id] = 0;
    }
  }

  console.log("docToPagesCountMap", docToPagesCountMap);
  // console.log("docToPagesCount", docToPagesCount);
  console.log("reportToDocsMap", reportToDocsMap);
  console.log("reportsPagesCounts", reportsPagesCounts);
  return reportsPagesCounts;
}
compileReportsWithPageCounts();

// iterate through all reports, and for each reportId, need to look through all documents associated with that reportId, sum up count of pages associated with a
// document and associate that value with each reportId
// we are iterating through all reports, and all documents here

// // create object "test" by iterating through documents
// // for each document, check if the report_id of that document is in "test"
// // if it isn't, create an entry in test where key is report_id and value is an object of structure {}

// // maps report ids to document ids - maybe use a set to hold doc ids for each report
// var reportsToDocs = {
//   4: { 21: true, 37: true, 54: true },
//   5: { 23: true, 3: true, 5: true },
// };

// // maps page ids to document ids
// var pageToDocs = {
//   1: 21,
//   2: 21,
// };

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

  // if passed an invalid report, do we end the function early?
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
  // console.log("documents matching", documentsMatching);
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
