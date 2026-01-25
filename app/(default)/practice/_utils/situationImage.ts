import { detailSituations } from "../_constants/detailSituations";

/**
 * 상황과 페이지 번호에 따라 이미지 경로를 반환합니다.
 * 각 상황의 모든 세부 상황이 같은 이미지를 사용합니다.
 * @param situationId - 메인 상황 ID (fire, emergency, injury, drowning)
 * @param detailId - 세부 상황 ID
 * @param pageNumber - 페이지 번호 (1 또는 2)
 * @returns 이미지 경로
 */
export function getSituationImagePath(
	situationId: string,
	detailId: string,
	pageNumber: number,
): string {
	const situationMap: Record<string, number> = {
		fire: 1,
		emergency: 2,
		injury: 3,
		drowning: 4,
	};

	const situationNum = situationMap[situationId];
	if (!situationNum) {
		return "/dummy.png";
	}

	const situations =
		detailSituations[situationId as keyof typeof detailSituations];
	const detailIndex = situations.findIndex((s) => s.id === detailId);
	const detailNum = detailIndex !== -1 ? detailIndex + 1 : 0;

	if (detailNum > 0) {
		const specificImagePath = `/situation/${situationNum}-${detailNum}-${pageNumber}.png`;
		// NOTE: 이상적으로는 여기서 specificImagePath에 해당하는 파일이 실제로 존재하는지 확인해야 합니다.
		// (예: fs.existsSync). 하지만, 클라이언트 사이드에서는 직접적인 파일 시스템 접근이 불가능하므로,
		// 일단 경로를 구성하고, 이미지가 없는 경우 브라우저에서 404 에러를 반환하게 됩니다.
		// 만약 파일 존재 여부 확인이 꼭 필요하다면, 별도의 API를 통해 확인해야 합니다.
		// 여기서는 새로운 이미지 경로 규칙을 적용하는 데에 초점을 맞춥니다.
		return specificImagePath;
	}

	// 기존 이미지 경로로 fallback
	const fallbackImagePath = `/situation/${situationNum}-${pageNumber}.png`;
	return fallbackImagePath;
}
