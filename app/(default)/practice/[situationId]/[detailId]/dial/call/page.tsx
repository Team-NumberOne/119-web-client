"use client";

import Image from "next/image";
import { useCallback, useState } from "react";
import { IconWrapper } from "@/components/icons/IconWrapper";
import { CallEndPopup } from "./components/CallEndPopup";
import { Waveform } from "./components/Waveform";
import { useCallPage } from "./hooks/useCallPage";
import { useVoiceDetection } from "./hooks/useVoiceDetection";

type MicTextState = "idle" | "listening" | "reset";

const micTextMap: Record<MicTextState, string> = {
	idle: "마이크를 누르고 말해줘",
	listening: "잘 듣고 있어요",
	reset: "다시 하려면 마이크를 누르고 말해줘",
};

export default function CallPage() {
	const {
		seconds,
		currentQuestion,
		callScript,
		showEndPopup,
		reportId,
		formatTime,
		formatQuestion,
		router,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		setShowEndPopup,
		addAnswer,
		submitReport,
	} = useCallPage();

	const [isRecording, setIsRecording] = useState(false);
	const [waveformResetKey, setWaveformResetKey] = useState(0);

	// ✅ 문구 상태(3종)
	const [micTextState, setMicTextState] = useState<MicTextState>("idle");

	const handleAutoPause = useCallback(() => {
		setIsRecording(false);
		setMicTextState("idle");
	}, []);

	// ✅ 최종 transcript를 인자로 받는다
	const handleSpeechEnd = useCallback(
		async (finalTranscript: string) => {
			setIsRecording(false);
			setMicTextState("idle");

			if (finalTranscript) {
				addAnswer(finalTranscript);
			}

			const isLast = currentQuestionIndex >= callScript.questions.length - 1;

			if (!isLast) {
				setCurrentQuestionIndex((prev) => prev + 1);
				return;
			}

			const id = await submitReport();

			if (id !== null) {
				setShowEndPopup(true);
			} else {
				console.log("[Call] 리포트 제출 실패");
			}
		},
		[
			addAnswer,
			currentQuestionIndex,
			callScript.questions.length,
			setCurrentQuestionIndex,
			submitReport,
			setShowEndPopup,
		],
	);

	const handleSpeechResult = useCallback((transcript: string) => {
		console.log("[SpeechRecognition] Result:", transcript);
	}, []);

	const { analyserNode, cleanup } = useVoiceDetection({
		isRecording,
		onAutoPause: handleAutoPause,
		onSpeechEnd: handleSpeechEnd,
		onSpeechResult: handleSpeechResult,
	});

	// ✅ 리셋 버튼: “다시 하려면 …” 상태로 변경
	const handleResetWaveform = useCallback(() => {
		// 녹음 종료 + 문구를 reset으로
		setIsRecording(false);
		setMicTextState("reset");

		// 마이크/감지기 정리
		cleanup();

		// 웨이브폼만 리셋
		setWaveformResetKey((prev) => prev + 1);
	}, [cleanup]);

	// ✅ 마이크 시작: reset/idle 상관없이 listening으로
	const handleStartRecording = useCallback(() => {
		setIsRecording(true);
		setMicTextState("listening");
	}, []);

	return (
		<div
			className="h-full w-full flex flex-col items-center"
			style={{ marginTop: "clamp(2rem, 5vw, 3.5rem)" }}
		>
			<div
				className="flex flex-col w-full items-center flex-1"
				style={{ gap: "clamp(0.75rem, 2vw, 1rem)" }}
			>
				<div className="flex flex-col items-center">
					<IconWrapper
						name="Phone"
						size={24}
						color="var(--color-gray-100)"
						style={{ marginBottom: "clamp(0.125rem, 0.5vw, 0.25rem)" }}
					/>
					<div className="text-h4 text-gray-600">119</div>
					<div className="text-body-2 text-gray-100">{formatTime(seconds)}</div>
				</div>

				<div
					className="text-h6 text-gray-600 text-center h-[56px]"
					style={{
						marginTop: "clamp(0.75rem, 2vw, 1rem)",
						whiteSpace: "pre-line",
					}}
				>
					{formatQuestion(currentQuestion?.question || callScript.start)}
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
								<div className="text-h6 text-gray-700">
									{currentQuestion?.hintTitle || "무슨일이"}
								</div>
								<div className="text-body-2 text-gray-500">
									{currentQuestion?.hintDescription ||
										"일어났는지 천천히 말해봐요"}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* 마이크 */}
				<div className="flex flex-col items-center gap-3">
					<div className="text-caption text-gray-500">
						{micTextMap[micTextState]}
					</div>

					{!isRecording && (
						<button
							type="button"
							onClick={handleStartRecording}
							className="flex items-center justify-center w-14 h-14 rounded-full bg-white"
						>
							<div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
								<Image src="/voice.svg" alt="마이크" width={24} height={24} />
							</div>
						</button>
					)}

					{isRecording && (
						<div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full">
							<Waveform
								analyserNode={analyserNode}
								isActive={isRecording}
								width={208}
								height={24}
								key={waveformResetKey}
							/>
							<button
								type="button"
								onClick={handleResetWaveform}
								className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-600 hover:bg-gray-700 transition-colors"
								aria-label="웨이브폼 리셋"
							>
								<Image src="/reset.svg" alt="리셋" width={24} height={24} />
							</button>
						</div>
					)}
				</div>
			</div>

			<CallEndPopup
				isOpen={showEndPopup}
				onViewResult={() => {
					if (reportId !== null) {
						router.push(`/report/${reportId}`);
					} else {
						console.log("[Call] 리포트 ID가 없습니다. 리포트 생성 로직 필요");
						setShowEndPopup(false);
					}
				}}
			/>
		</div>
	);
}
