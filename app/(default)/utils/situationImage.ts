/**
 * 상황과 페이지 번호에 따라 이미지 경로를 반환합니다.
 * 각 상황의 모든 세부 상황이 같은 이미지를 사용합니다.
 * @param situationId - 메인 상황 ID (fire, emergency, injury, drowning)
 * @param pageNumber - 페이지 번호 (1 또는 2)
 * @returns 이미지 경로
 */
export function getSituationImagePath(
	situationId: string,
	pageNumber: number,
): string {
	// 각 상황별 이미지 매핑 (상황 번호-페이지 번호)
	const imageMap: Record<string, Record<number, string>> = {
		fire: {
			1: "/situation/1-1.png",
			2: "/situation/1-2.png",
		},
		emergency: {
			1: "/situation/2-1.png",
			2: "/situation/2-2.png",
		},
		injury: {
			1: "/situation/3-1.png",
			2: "/situation/3-2.png",
		},
		drowning: {
			1: "/situation/4-1.png",
			2: "/situation/4-2.png",
		},
	};

	return imageMap[situationId]?.[pageNumber] || "/dummy.png";
}
