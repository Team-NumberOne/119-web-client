"use client";

import { useCallback, useState } from "react";
import type { ConversationScript } from "@/lib/api/bbiyoung";
import { submitConversation } from "@/lib/api/bbiyoung";
import { getSituationIdForAPI } from "../_utils/situationIdMapping";

interface UseCallSubmissionOptions {
	detailId: string;
}

export function useCallSubmission({ detailId }: UseCallSubmissionOptions) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [reportId, setReportId] = useState<number | null>(null);
	const [showEndPopup, setShowEndPopup] = useState(false);

	// 실제 클라이언트 IP 가져오기
	const getClientIP = useCallback(async (): Promise<string> => {
		try {
			const response = await fetch("https://api.ipify.org?format=json");
			const data = await response.json();
			return data.ip || "192.168.1.1";
		} catch (error) {
			console.error("[IP] IP 조회 실패:", error);
			return "192.168.1.1"; // 기본값
		}
	}, []);

	// API 호출 함수
	const handleSubmitConversation = useCallback(
		async (script: ConversationScript[]) => {
			if (isSubmitting) return;

			setIsSubmitting(true);
			try {
				const apiId = getSituationIdForAPI(detailId);
				const clientIP = await getClientIP();

				const result = await submitConversation({
					ip: clientIP,
					id: String(apiId),
					script,
				});

				// 팝업 표시
				setReportId(result.resultId);
				setShowEndPopup(true);
			} catch (error) {
				console.error("[API] 오류:", error);
				alert("결과를 가져오는 중 오류가 발생했습니다.");
			} finally {
				setIsSubmitting(false);
			}
		},
		[detailId, isSubmitting, getClientIP],
	);

	return {
		isSubmitting,
		reportId,
		showEndPopup,
		handleSubmitConversation,
	};
}
