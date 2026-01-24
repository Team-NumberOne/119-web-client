import { notFound } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "../_constants/detailSituations";
import { DetailSituationList } from "./components/DetailSituationList";
import { DetailSituationTitle } from "./components/DetailSituationTitle";

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

			<DetailSituationList situationId={situationId} situations={situations} />
		</div>
	);
}
