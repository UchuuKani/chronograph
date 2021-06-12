import { IStore, IReport } from "./index";

export function accessReportData(
  reportId: number,
  dataStore: IStore
): IReport | string {
  const report = dataStore.report[reportId];

  if (report !== undefined) {
    return report;
  } else {
    return "No report found with ID " + reportId;
  }
}
