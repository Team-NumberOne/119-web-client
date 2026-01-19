import Image from "next/image";
import { notFound } from "next/navigation";
import { practiceQuestions } from "@/app/constants/practiceQuestions";
import { PracticeOptionButton } from "./components/PracticeOptionButton";

interface PracticeQuestionPageProps {
	params: Promise<{ situationId: string; detailId: string }>;
}

export default async function PracticeQuestionPage({
	params,
}: PracticeQuestionPageProps) {
	const { detailId } = await params;

	const question = practiceQuestions[detailId];

	if (!question) {
		notFound();
	}

	return (
		<div className="h-full overflow-hidden flex flex-col gap-[28px]">
			<div className="text-center flex flex-col gap-1 mt-[70px]">
				<div className="text-body-1 text-gray-400">
					이 상황에서 어떻게 행동해야 할까요?
				</div>
				<div className="text-h5 text-gray-600">
					부엌에서 냄비 연기가 나요.
					<br />
					불꽃은 안 보여요.
				</div>
			</div>
			<div className="bg-white flex items-center justify-center flex-1 min-h-0 p-5 mx-5 rounded-[20px] shadow-layered">
				<div className="relative w-full h-full max-w-[280px]">
					<Image
						src="/dummy.png"
						alt="상황 일러스트"
						fill
						className="object-contain"
					/>
				</div>
			</div>
			<div className="flex flex-col gap-2 mx-5">
				<PracticeOptionButton>119에 신고해요</PracticeOptionButton>
				<PracticeOptionButton>119에 신고해요</PracticeOptionButton>
			</div>
		</div>
	);
}
