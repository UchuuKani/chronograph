const store = require("./store");
const {
  compileReportsWithPageCounts,
  determineNumberPagesInReport,
  keywordSearch,
} = require("./dataHandling");

console.log(
  "compile single report with page count",
  determineNumberPagesInReport(4, store)
);

console.log(
  "compile all reports and page counts",
  compileReportsWithPageCounts(store)
);

console.log("key word searching", keywordSearch(store, "et"));
