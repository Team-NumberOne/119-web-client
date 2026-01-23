import { notFound } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "../../../../constants/detailSituations";
import { practiceQuestions } from "../../../../constants/practiceQuestions";
import { getSituationImagePath } from "../../../../utils/situationImage";
import { PracticeOptionButton } from "../components/PracticeOptionButton";

interface PracticeQuestionPageProps {
	params: Promise<{
		situationId: string;
		detailId: string;
		pageNumber: string;
	}>;
}

export default async function PracticeQuestionPage({
	params,
}: PracticeQuestionPageProps) {
	const { situationId, detailId, pageNumber } = await params;

	// pageNumber를 숫자로 변환 (1 또는 2)
	const pageIndex = parseInt(pageNumber, 10);
	if (Number.isNaN(pageIndex) || pageIndex < 1 || pageIndex > 2) {
		notFound();
	}

	// 유효한 situationId인지 확인
	if (!(situationId in detailSituations)) {
		notFound();
	}

	const situations = detailSituations[situationId as SituationId];
	const situation = situations.find((s) => s.id === detailId);

	if (!situation) {
		notFound();
	}

	// detailId와 pageNumber를 조합해서 질문 키 생성
	const questionKey = `${situation.id}-${pageIndex}`;
	const question = practiceQuestions[questionKey];

	if (!question) {
		notFound();
	}

	// 이미지 경로 가져오기 (상황별로 동일한 이미지 사용)
	const imagePath = getSituationImagePath(situationId, pageIndex);

	return (
		<div className="h-full overflow-hidden flex flex-col gap-[28px]">
			<div className="text-center flex flex-col gap-1 mt-[70px]">
				<div className="text-body-1 text-gray-400">
					이 상황에서 어떻게 행동해야 할까요?
				</div>
				<div className="text-h5 text-gray-600">
					{situation.location} {situation.description}
				</div>
			</div>
			<div
				className="bg-white flex items-center justify-center flex-1 min-h-0 mx-5 rounded-[20px] shadow-layered bg-cover bg-center bg-no-repeat"
				style={{ backgroundImage: `url(${imagePath})` }}
			/>
			<div className="flex flex-col gap-2 mx-5">
				{question.options.map((option) => (
					<PracticeOptionButton
						key={option.id}
						isCorrect={option.isCorrect}
						pageNumber={pageIndex}
						situationId={situationId}
						detailId={detailId}
						incorrectFeedback={question.incorrectFeedback}
					>
						{option.text}
					</PracticeOptionButton>
				))}
			</div>
		</div>
	);
}
