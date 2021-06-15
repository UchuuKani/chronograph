import store from "./store";
import {
  compileReportsWithPageCounts,
  determineNumberPagesInReport,
  keywordSearch,
} from "./dataHandling";

console.log(compileReportsWithPageCounts(store));

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

console.log(determineNumberPagesInReport(4, store));

console.log("key word searching", keywordSearch(store, "et"));
