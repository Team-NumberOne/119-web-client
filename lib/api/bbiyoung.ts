import type { ReportData } from "@/app/(report)/report/[reportId]/types/report";
import { apiClient } from "./client";

export interface ConversationScript {
	question: string;
	answer: string;
}

export interface SubmitConversationRequest {
	ip: string;
	id: number | string;
	script: ConversationScript[];
}

/**
 * 리포트 조회
 */
export async function fetchReport(reportId: string): Promise<ReportData> {
	return apiClient.get<ReportData>(`/bbiyoung/${reportId}`);
}

/**
 * 대화 스크립트 제출하여 리포트 생성
 */
export async function submitConversation(
	request: SubmitConversationRequest,
): Promise<ReportData> {
	return apiClient.post<ReportData>("/bbiyoung", request);
}
