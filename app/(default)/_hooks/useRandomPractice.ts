"use client";

import { useRouter } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "../practice/_constants/detailSituations";

export function useRandomPractice() {
	const router = useRouter();

	const getRandomSituation = () => {
		// 모든 상세상황을 평탄화하여 배열로 만들기
		const allDetailSituations: Array<{
			situationId: SituationId;
			detailId: string;
		}> = [];

		(Object.keys(detailSituations) as SituationId[]).forEach((situationId) => {
			detailSituations[situationId].forEach((detail) => {
				allDetailSituations.push({
					situationId,
					detailId: detail.id,
				});
			});
		});

		// 랜덤으로 하나 선택
		const randomIndex = Math.floor(Math.random() * allDetailSituations.length);
		return allDetailSituations[randomIndex];
	};

	const navigateToRandomPractice = () => {
		const selected = getRandomSituation();
		router.push(`/practice/${selected.situationId}/${selected.detailId}/dial`);
	};

	return {
		navigateToRandomPractice,
	};
}
