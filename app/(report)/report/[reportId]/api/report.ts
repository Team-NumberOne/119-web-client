import type { BbiyoungResponse } from "../types/report";

export async function fetchReport(
	reportId: string,
): Promise<BbiyoungResponse["data"]> {
	const response = await fetch(
		`http://api.daepiro.site/api/v1/bbiyoung/${reportId}`,
	);

	if (!response.ok) {
		throw new Error(`API 호출 실패: ${response.status}`);
	}

	const data: BbiyoungResponse = await response.json();

	if (data.code === 1000 || data.code === 0) {
		return data.data;
	}

	throw new Error(data.message);
}
