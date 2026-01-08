"use client";

import type { DetailSituation } from "../../../constants/detailSituations";
import { DetailSituationCard } from "./DetailSituationCard";

interface DetailSituationListProps {
	situationId: string;
	situations: DetailSituation[];
}

export function DetailSituationList({
	situationId,
	situations,
}: DetailSituationListProps) {
	const handleCardClick = (detailId: string) => {
		// TODO: 다음 단계로 이동하는 로직 구현
		console.log(`Selected: ${situationId} - ${detailId}`);
	};

	return (
		<div className="flex-1 min-h-0 overflow-y-auto pt-8 px-5 pb-4">
			<div className="flex flex-col gap-3 items-center">
				{situations.map((situation) => (
					<DetailSituationCard
						key={situation.id}
						situation={situation}
						onClick={() => handleCardClick(situation.id)}
					/>
				))}
			</div>
		</div>
	);
}
