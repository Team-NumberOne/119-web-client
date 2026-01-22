import { notFound, redirect } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "@/app/constants/detailSituations";

interface DetailSituationSelectPageProps {
	params: Promise<{ situationId: string; detailId: string }>;
}

export default async function DetailSituationSelectPage({
	params,
}: DetailSituationSelectPageProps) {
	const { situationId, detailId } = await params;

	// 유효한 situationId인지 확인
	if (!(situationId in detailSituations)) {
		notFound();
	}

	const situations = detailSituations[situationId as SituationId];
	const situation = situations.find((s) => s.id === detailId);

	if (!situation) {
		notFound();
	}

	// 첫 번째 선택 페이지로 리다이렉트
	redirect(`/practice/${situationId}/${detailId}/1`);
}
