"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ConversationScript } from "@/lib/api/bbiyoung";

export const QUESTIONS = [
	"어떤 일이 발생했나요?",
	"그 위치가 어디인가요?",
	"현재 상황을 더 자세히 설명해주세요.",
	"위험한 요소가 더 있나요?",
	"추가로 알려주실 것이 있나요?",
];

interface UseCallConversationOptions {
	onComplete: (script: ConversationScript[]) => void;
}

export function useCallConversation({
	onComplete,
}: UseCallConversationOptions) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [hasProcessedAnswer, setHasProcessedAnswer] = useState(false);
	const conversationScriptRef = useRef<ConversationScript[]>([]);

	// 질문 인덱스가 0으로 리셋될 때 대화 스크립트도 초기화
	useEffect(() => {
		if (currentQuestionIndex === 0) {
			conversationScriptRef.current = [];
		}
	}, [currentQuestionIndex]);

	const currentQuestion = QUESTIONS[currentQuestionIndex];
	const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

	const handleAnswerComplete = useCallback(
		(answerText: string, resetTranscript: () => void) => {
			// 이미 처리된 경우 중복 호출 방지
			if (hasProcessedAnswer) {
				return;
			}

			const newScript: ConversationScript = {
				question: currentQuestion,
				answer: answerText.trim() || "", // 빈 답변도 허용
			};

			setHasProcessedAnswer(true);

			// 대화 스크립트에 추가
			conversationScriptRef.current = [
				...conversationScriptRef.current,
				newScript,
			];

			// 다음 질문으로 이동 또는 완료
			if (!isLastQuestion) {
				const nextIndex = currentQuestionIndex + 1;
				setCurrentQuestionIndex(nextIndex);
			} else {
				// 마지막 질문 완료 - 콜백 호출
				onComplete(conversationScriptRef.current);
			}
			resetTranscript();
		},
		[
			currentQuestion,
			currentQuestionIndex,
			hasProcessedAnswer,
			isLastQuestion,
			onComplete,
		],
	);

	const resetAnswerProcessed = useCallback(() => {
		setHasProcessedAnswer(false);
	}, []);

	return {
		currentQuestionIndex,
		currentQuestion,
		isLastQuestion,
		handleAnswerComplete,
		resetAnswerProcessed,
	};
}
