import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchReport } from "../api/report";

export function useReport(reportId: string) {
	return useSuspenseQuery({
		queryKey: ["report", reportId],
		queryFn: () => fetchReport(reportId),
	});
}
