"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { IconWrapper } from "@/components/icons/IconWrapper";
import { getSituationIdForAPI } from "../../../../../utils/situationIdMapping";
import { Waveform } from "./components/Waveform";
import { useSpeechToText } from "./hooks/useSpeechToText";
import { useVoiceDetection } from "./hooks/useVoiceDetection";

interface ConversationScript {
	question: string;
	answer: string;
}

interface BbiyoungResponse {
	code: number;
	message: string;
	data: {
		resultId: number;
		title: string;
		totalScore: number;
		itemScores: Array<{
			title: string;
			score: number;
		}>;
		comment: string;
	};
}

const QUESTIONS = [
	"어떤 일이 발생했나요?",
	"그 위치가 어디인가요?",
	"현재 상황을 더 자세히 설명해주세요.",
	"위험한 요소가 더 있나요?",
	"추가로 알려주실 것이 있나요?",
];

export default function CallPage() {
	const [seconds, setSeconds] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasProcessedAnswer, setHasProcessedAnswer] = useState(false);
	const params = useParams();
	const router = useRouter();
	const detailId = (params.detailId as string) || "";
	const situationId = params.situationId as string;

	// detailId가 없으면 기본값 설정 (랜덤 연습 등에서 직접 접근한 경우)
	useEffect(() => {
		if (!detailId && situationId) {
			// situationId에 해당하는 첫 번째 detailId로 리다이렉트
			import("../../../../../constants/detailSituations").then(
				({ detailSituations }) => {
					const situations =
						detailSituations[situationId as keyof typeof detailSituations];
					if (situations && situations.length > 0) {
						const firstDetailId = situations[0].id;
						router.replace(
							`/practice/${situationId}/${firstDetailId}/dial/call`,
						);
					}
				},
			);
		}
	}, [detailId, situationId, router]);

	// 통화 시간 타이머
	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Speech-to-Text 훅 사용
	const { transcript, resetTranscript } = useSpeechToText({
		isRecording,
	});

	// 실제 클라이언트 IP 가져오기
	const getClientIP = useCallback(async (): Promise<string> => {
		try {
			const response = await fetch("https://api.ipify.org?format=json");
			const data = await response.json();
			return data.ip || "192.168.1.1";
		} catch (error) {
			console.error("[IP] IP 조회 실패:", error);
			return "192.168.1.1"; // 기본값
		}
	}, []);

	// API 호출 함수
	const handleSubmitConversation = useCallback(
		async (script: ConversationScript[]) => {
			if (isSubmitting) return;

			setIsSubmitting(true);
			try {
				const apiId = getSituationIdForAPI(detailId);
				const clientIP = await getClientIP();

				const response = await fetch(
					"http://api.daepiro.site/api/v1/bbiyoung",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							accept: "*/*",
						},
						body: JSON.stringify({
							ip: clientIP,
							id: apiId,
							script,
						}),
					},
				);

				if (!response.ok) {
					throw new Error(`API 호출 실패: ${response.status}`);
				}

				const data: BbiyoungResponse = await response.json();
				if (data.code === 1000) {
					// 리포트 페이지로 리다이렉트
					router.push(`/report/${data.data.resultId}`);
				} else {
					throw new Error(data.message);
				}
			} catch (error) {
				console.error("[API] 오류:", error);
				alert("결과를 가져오는 중 오류가 발생했습니다.");
			} finally {
				setIsSubmitting(false);
			}
		},
		[detailId, isSubmitting, getClientIP, router],
	);

	// 답변 완료 처리 (자동 일시정지 또는 수동 중지 시)
	const handleAnswerComplete = useCallback(() => {
		// 이미 처리된 경우 중복 호출 방지
		if (hasProcessedAnswer) {
			return;
		}

		const currentQuestion = QUESTIONS[currentQuestionIndex];
		const answerText = transcript.trim() || ""; // 빈 답변도 허용

		const newScript: ConversationScript = {
			question: currentQuestion,
			answer: answerText,
		};

		setHasProcessedAnswer(true);

		// 다음 질문으로 이동 또는 완료
		if (currentQuestionIndex < QUESTIONS.length - 1) {
			const nextIndex = currentQuestionIndex + 1;
			setConversationScript((prev) => [...prev, newScript]);
			setCurrentQuestionIndex(nextIndex);
		} else {
			// 5번 질문 완료 - API 호출
			setConversationScript((prev) => {
				const updatedScript = [...prev, newScript];
				handleSubmitConversation(updatedScript);
				return updatedScript;
			});
		}
		resetTranscript();
	}, [
		transcript,
		currentQuestionIndex,
		hasProcessedAnswer,
		resetTranscript,
		handleSubmitConversation,
	]);

	// 녹음이 중지되었을 때 자동으로 답변 완료 처리
	const prevIsRecordingRef = useRef(isRecording);

	useEffect(() => {
		// 녹음이 시작되면 처리 플래그 리셋
		if (isRecording) {
			setHasProcessedAnswer(false);
			prevIsRecordingRef.current = isRecording;
			return;
		}

		// 녹음이 true에서 false로 변경되었을 때만 처리 (실제 녹음 중지 감지)
		const wasRecording = prevIsRecordingRef.current;
		prevIsRecordingRef.current = isRecording;

		if (wasRecording && !isRecording && !hasProcessedAnswer) {
			// 약간의 지연을 주어 transcript가 완전히 업데이트되도록 함
			const timer = setTimeout(() => {
				handleAnswerComplete();
			}, 300);
			return () => clearTimeout(timer);
		}
	}, [isRecording, hasProcessedAnswer, handleAnswerComplete]);

	// 자동 일시정지 함수
	const handleAutoPause = useCallback(() => {
		setIsRecording(false);
		// handleAnswerComplete는 useEffect에서 자동으로 호출됨
	}, []);

	// Voice Detection 훅 사용
	const { analyserNode, cleanup } = useVoiceDetection({
		isRecording,
		onAutoPause: handleAutoPause,
	});

	// 마이크 시작/중지
	const handleMicClick = useCallback(() => {
		if (!isRecording) {
			setIsRecording(true);
		} else {
			cleanup();
			setIsRecording(false);
			// handleAnswerComplete는 useEffect에서 자동으로 호출됨
		}
	}, [isRecording, cleanup]);

	// 시간 포맷팅 (00:00)
	const formatTime = (totalSeconds: number) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	return (
		<div
			className="h-full w-full flex flex-col items-center"
			style={{ marginTop: "clamp(2rem, 5vw, 3.5rem)" }}
		>
			{/* 상단: 통화 정보 */}
			<div
				className="flex flex-col w-full items-center flex-1"
				style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}
			>
				{/* 전화 아이콘 */}
				<div className="flex flex-col items-center">
					<IconWrapper
						name="Phone"
						size={24}
						color="var(--color-gray-100)"
						style={{ marginBottom: "clamp(0.125rem, 0.5vw, 0.25rem)" }}
					/>
					{/* 119 번호 */}
					<div className="text-h4 text-gray-600">119</div>

					{/* 통화 시간 */}
					<div className="text-body-2 text-gray-100">{formatTime(seconds)}</div>
				</div>
				{/* 질문 */}
				<div
					className="text-h6 text-gray-600 text-center"
					style={{ marginTop: "clamp(0.75rem, 2vw, 1rem)" }}
				>
					{currentQuestionIndex === 0 ? (
						<>
							119입니다. <br /> {QUESTIONS[currentQuestionIndex]}
						</>
					) : (
						QUESTIONS[currentQuestionIndex]
					)}
				</div>
				{/* Hint 박스 */}
				<div
					className="px-5 w-full"
					style={{
						height: "clamp(200px, 18vw, 350px)",
						paddingTop: "clamp(0.5rem, 2vw, 0.75rem)",
						paddingBottom: "clamp(1.25rem, 3vw, 1.75rem)",
					}}
				>
					<div className="bg-green-radial w-full h-full flex justify-center items-center">
						<div
							className="px-5 mx-6 w-full bg-white-radial backdrop-blur-[2px] rounded-[24px] border-2 border-solid border-white/60 text-body-1 flex-col flex items-center justify-center"
							style={{
								paddingTop: "clamp(1rem, 3vw, 1.5rem)",
								paddingBottom: "clamp(1.25rem, 3vw, 1.75rem)",
								gap: "clamp(0.5rem, 2vw, 0.75rem)",
							}}
						>
							<div className="bg-white rounded-lg px-2 py-[2px] text-center text-primary-500 text-body-2-b">
								Hint
							</div>
							<div className="flex flex-col text-center">
								<div className="text-h6 text-gray-700">무슨일이</div>{" "}
								<div className="text-body-2 text-gray-500">
									{" "}
									일어났는지 천천히 말해봐요
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 안내 문구 / 음성 파형 */}
				{!isRecording ? (
					<div
						className="flex flex-col items-center"
						style={{ gap: "clamp(0.5rem, 2vw, 0.75rem)" }}
					>
						<div className="text-caption text-gray-500 text-center">
							마이크를 누르고 말해줘
						</div>
						<button
							type="button"
							onClick={handleMicClick}
							className="bg-white rounded-full w-14 h-14 flex justify-center items-center"
							aria-label="녹음 시작"
						>
							<div className="bg-primary-400 rounded-full w-8 h-8 flex justify-center items-center">
								<Image src="/voice.svg" alt="" width={24} height={24} />
							</div>
						</button>
					</div>
				) : (
					<div
						className="flex flex-col items-center px-5 w-full max-w-[320px]"
						style={{
							gap: "clamp(0.5rem, 2vw, 0.75rem)",
						}}
					>
						<div className="text-body-2 text-gray-600 text-center">
							잘 듣고 있어요
						</div>
						<div className="bg-white rounded-full w-full flex items-center shadow-sm gap-3 pl-4 pr-3 py-3">
							{/* 음성 파형 */}
							<Waveform analyserNode={analyserNode} isActive={isRecording} />
							{/* 일시정지 버튼 */}
							<button
								type="button"
								onClick={handleMicClick}
								className="bg-gray-600 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"
								aria-label="녹음 중지"
							>
								<div className="flex gap-[3px]">
									<div className="w-[2px] h-3 bg-white rounded-full" />
									<div className="w-[2px] h-3 bg-white rounded-full" />
								</div>
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
