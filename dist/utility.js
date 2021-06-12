"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.accessReportData = void 0;
function accessReportData(reportId, dataStore) {
    var report = dataStore.report[reportId];
    if (report !== undefined) {
        return report;
    }
    else {
        return "No report found with ID " + reportId;
    }
}
exports.accessReportData = accessReportData;
//# sourceMappingURL=utility.js.map