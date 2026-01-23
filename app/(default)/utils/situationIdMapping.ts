/**
 * detailId를 bbiyoung API의 숫자 ID로 매핑합니다.
 * 화재(1,2) / 의식 소실(3,4) / 부상(5,6) / 익수(7,8)
 */
export function getSituationIdForAPI(detailId: string): number {
	const mapping: Record<string, number> = {
		"fire-far": 1,
		"fire-near": 2,
		"emergency-friend": 3,
		"emergency-family": 4,
		"injury-me": 5,
		"injury-other": 6,
		"drowning-friend": 7,
		"drowning-family": 8,
	};

	return mapping[detailId] ?? 1; // 기본값은 1
}
