"use client";

import type { PracticeQuestion } from "@/app/constants/practiceQuestions";

interface PracticeQuestionContentProps {
	question: PracticeQuestion;
}

export function PracticeQuestionContent({
	question,
}: PracticeQuestionContentProps) {
	const handleOptionClick = (optionId: string) => {
		// TODO: 선택지 클릭 처리 로직 구현
		console.log("Selected option:", optionId);
	};

	return (
		<div className="flex-1 min-h-0 overflow-y-auto px-5 pb-4">
			<div className="flex flex-col items-center max-w-[320px] mx-auto">
				{/* 카드 */}
				<div className="w-full bg-white rounded-[20px] p-6 flex flex-col gap-4">
					{/* 질문 */}
					<div className="text-center">
						<h2 className="text-h5 text-gray-700 mb-3">{question.question}</h2>
						<p className="text-body-1 text-gray-600">{question.situation}</p>
					</div>

					{/* 캐릭터/일러스트 영역 */}
					{question.character && (
						<div className="flex justify-center my-4">{question.character}</div>
					)}

					{/* 선택지 */}
					<div className="flex flex-col gap-3 mt-2">
						{question.options.map((option) => (
							<button
								key={option.id}
								type="button"
								onClick={() => handleOptionClick(option.id)}
								className="w-full bg-gray-100 rounded-[12px] px-4 py-3 text-left text-body-1 text-gray-700 hover:bg-gray-200 transition-colors"
							>
								{option.text}
							</button>
						))}
					</div>

					{/* 안내 문구 */}
					<div className="text-center mt-4">
						<p className="text-caption text-gray-400">
							이 서비스는 실제 119 연결이 되지 않습니다.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
