import { fetchReport as fetchReportApi } from "@/lib/api/bbiyoung";
import type { ReportData } from "../types/report";

export async function fetchReport(reportId: string): Promise<ReportData> {
	return fetchReportApi(reportId);
}
