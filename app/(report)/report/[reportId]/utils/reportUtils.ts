/**
 * 제목에 따라 점수 범위 이미지와 상황별 이미지 경로를 반환합니다.
 */
export function getReportImagePaths(title: string): string {
	// 점수 범위 이미지 (더 구체적인 매칭 우선)
	if (title.includes("용감한 신고자")) return "/report/8190.png";
	if (title.includes("안전 전문가")) return "/report/7180.png";
	if (title.includes("신고 탐험가")) return "/report/6170.png";
	if (title.includes("신고 도전자")) return "/report/below60.png";

	// 상황별 이미지 (더 구체적인 매칭 우선)
	if (title.includes("불 지킴이")) return "/report/firesituation.png";
	if (title.includes("물 지킴이")) return "/report/drowningsituation.png";
	if (title.includes("안전 지킴이")) return "/report/injurysituation.png";
	if (title.includes("숨 지킴이")) return "/report/emergencysituation.png";

	return "/report/emergencysituation.png"; // 기본값
}

/**
 * 점수에 따라 헤더 텍스트를 반환합니다.
 */
export function getScoreHeaderText(totalScore: number): string {
	if (totalScore <= 60) return "60점 이하";
	if (totalScore <= 70) return "61-70점";
	if (totalScore <= 80) return "71-80점";
	if (totalScore <= 90) return "81-90점";
	return "90점 이상";
}

/**
 * 항목 제목을 한글로 변환합니다.
 */
export function getItemTitleLabel(title: string): string {
	const titleMap: Record<string, string> = {
		WHAT: "무엇이",
		WHERE: "어디에서",
		SELF_INFO: "본인 정보",
		WHO: "누가",
		RISK_FACTOR: "위험 요소",
		ACTION_GUIDE: "행동 지침",
		CONSCIOUSNESS_BREATHING: "의식 및 호흡 확인",
		PATIENT_IDENTIFICATION: "환자 파악",
		EXTERNAL_INJURY: "외상 여부 확인",
		CONSCIOUSNESS_PAIN: "의식 및 통증 확인",
		DANGER_SIGNAL: "위험 징후 확인",
		CONSCIOUSNESS_RESPONSE: "의식 및 반응 확인",
		STATUS_CHECK: "상태 확인",
		SUPPORT_ACTION: "보조 행동 안내",
	};
	return titleMap[title] || title;
}

/**
 * 항목 인덱스에 따라 진행 바 색상을 반환합니다.
 */
export function getProgressBarColor(index: number): string {
	const colors = [
		"bg-[#FC7269]", // 빨강
		"bg-[#FF9B70]", // 주황
		"bg-[#FFEA73]", // 노랑
		"bg-[#6ACF98]", // 초록
		"bg-[#8CC4FF]", // 파랑
	];
	return colors[index % colors.length];
}
