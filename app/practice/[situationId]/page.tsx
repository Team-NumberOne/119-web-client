import { notFound } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "@/app/constants/detailSituations";
import { DetailSituationList } from "@/app/practice/[situationId]/components/DetailSituationList";
import { DetailSituationTitle } from "@/app/practice/[situationId]/components/DetailSituationTitle";

interface DetailSituationPageProps {
	params: Promise<{ situationId: string }>;
}

export default async function DetailSituationPage({
	params,
}: DetailSituationPageProps) {
	const { situationId } = await params;

	// 유효한 situationId인지 확인
	if (!(situationId in detailSituations)) {
		notFound();
	}

	const situations = detailSituations[situationId as SituationId];

	return (
		<div className="h-full overflow-hidden flex flex-col bg-gray-50">
			<DetailSituationTitle />

			{/* 세부 상황 리스트 (스크롤 가능) */}
			<DetailSituationList situationId={situationId} situations={situations} />
		</div>
	);
}
