import {
  getReportById,
  getDocumentById,
  getPageById,
  getReports,
  getDocuments,
  getPages,
} from "./utility";
import store, { IStore, IDocument, IPage, IReport } from "./store";

// iterate through all pages and make object where key is document id, and value is a set or array, whatever, that contains all pages for a document
export function compileReportsWithPageCounts(dataStore: IStore) {
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

// would a trie be appropriate here?
export function keywordSearch(
  dataStore: IStore,
  searchTerm: string
): IReport[] {
  // use an array to hold reports that match search term, and an object to know which reports have already been added to the report list
  let matchingReports: IReport[] = [];
  let addedReports: { [reportId: string]: boolean } = {};

  // iterate through all reports and check if string fields contain search term - should this be case-sensitive? Probably not
  // assuming report titles will be relatively small (< 100 characters)
  let reports = getReports(dataStore);
  let reportIds = Object.keys(reports);

  for (let id of reportIds) {
    let currentReport = reports[Number(id)];

    // if we find the search term in the report title, and the title id is not in addedReports map object, add report to list and map
    if (
      addedReports[id] === undefined &&
      currentReport?.title?.indexOf(searchTerm) > -1
    ) {
      matchingReports.push(reports[Number(id)]);
      addedReports[id] = true;
    }
  }

  // iterate through all documents and check if string fields contain search term - should this be case-sensitive? Probably not
  // assuming document names will be relatively small (< 100 characters)
  let documents = getDocuments(dataStore);
  let documentIds = Object.keys(documents);

  for (let docId of documentIds) {
    let currentDocument = documents[Number(docId)];

    // access the report associated with the document
    let relatedReport = reports[currentDocument.report_id];
    if (
      addedReports[relatedReport.id] === undefined &&
      currentDocument?.name?.indexOf(searchTerm) > -1
    ) {
      matchingReports.push(relatedReport);
      addedReports[relatedReport.id] = true;
    }
  }

  // iterate through TEXT fields in all pages and check if those fields contain the search term - should probably not be case-sensitive
  // assuming the page.body will be much larger than any other field searched thus far, and page.footnote will be longer than any fields in
  // reports or documents, but shorter than page.body
  let pages = getPages(dataStore);
  let pageIds = Object.keys(pages);

  for (let pageId of pageIds) {
    let currentPage = pages[Number(pageId)];

    // access the document and report associated with the page
    let relatedDocument = documents[currentPage.document_id];
    let relatedReport = reports[relatedDocument.report_id];

    // first make sure the report associated with the current page is not in the list of reports that match the search term
    // if the report is not already included, and either the page footnote or body include the search term, add the associated report to
    // the list we return and add the report ID to the map tracking which reports have already been added
    if (
      addedReports[relatedReport.id] === undefined &&
      (currentPage?.footnote?.indexOf(searchTerm) > -1 ||
        currentPage?.body?.indexOf(searchTerm))
    ) {
      matchingReports.push(relatedReport);
      addedReports[relatedReport.id] = true;
    }
  }

  return matchingReports;
}

// choosing to pass in the data source we would read from in case there are multiple data sources with the same structure as IStore
export function determineNumberPagesInReport(
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
  const reportData = getReportById(reportId, dataStore);
  try {
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
  } catch (err) {
    console.log(err);
  }
}
