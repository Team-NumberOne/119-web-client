"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { IconWrapper } from "@/components/icons/IconWrapper";
import { Waveform } from "./components/Waveform";
import { useVoiceDetection } from "./hooks/useVoiceDetection";

export default function CallPage() {
	const [seconds, setSeconds] = useState(0);
	const [isRecording, setIsRecording] = useState(false);

	// 통화 시간 타이머
	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// 자동 일시정지 함수
	const handleAutoPause = useCallback(() => {
		console.log("[Auto Pause] 자동 일시정지 실행");
		setIsRecording(false);
	}, []);

	// Voice Detection 훅 사용
	const { analyserNode, cleanup } = useVoiceDetection({
		isRecording,
		onAutoPause: handleAutoPause,
	});

	// 마이크 시작/중지
	const handleMicClick = useCallback(() => {
		if (!isRecording) {
			console.log("[Mic] 녹음 시작");
			setIsRecording(true);
		} else {
			console.log("[Mic] 녹음 중지 (수동)");
			cleanup();
			setIsRecording(false);
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
					119입니다. <br /> 어떤 일이 발생했나요?
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
