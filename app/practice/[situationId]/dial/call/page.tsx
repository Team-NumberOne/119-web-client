"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { IconWrapper } from "@/components/icons/IconWrapper";

export default function CallPage() {
	const [seconds, setSeconds] = useState(0);
	const [isRecording, setIsRecording] = useState(false);
	const waveformRef = useRef<HTMLDivElement>(null);
	const wavesurferRef = useRef<WaveSurfer | null>(null);
	const recordRef = useRef<RecordPlugin | null>(null);

	// 통화 시간 타이머
	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// WaveSurfer 초기화 (녹음 시작 시)
	useEffect(() => {
		if (!isRecording || !waveformRef.current || wavesurferRef.current) return;

		const wavesurfer = WaveSurfer.create({
			container: waveformRef.current,
			waveColor: "#D1D5DB",
			progressColor: "#D1D5DB",
			cursorColor: "transparent",
			barWidth: 2,
			barGap: 2,
			barRadius: 99,
			barMinHeight: 2, // 최소 높이를 1로 설정하여 작은 소리도 표현
			normalize: true, // 정규화를 유지하여 전체 높이 활용
			hideScrollbar: true,
			height: 24, // 높이를 2배로 늘려서 더 민감하게 보이도록
		});

		// Record 플러그인 설정 (기존 유지)
		const record = wavesurfer.registerPlugin(
			RecordPlugin.create({
				scrollingWaveform: true, // 실시간으로 파형이 옆으로 흐르게 합니다.
				scrollingWaveformWindow: 20, // 화면에 10초 분량의 파형을 보여줍니다.
			}),
		);

		wavesurferRef.current = wavesurfer;
		recordRef.current = record;

		// 마이크 시작
		record.startMic().catch((error) => {
			console.error("마이크 접근 오류:", error);
			alert("마이크 접근 권한이 필요합니다.");
			setIsRecording(false);
		});
		record.startRecording();

		return () => {
			if (wavesurferRef.current) {
				wavesurferRef.current.destroy();
				wavesurferRef.current = null;
				recordRef.current = null;
			}
		};
	}, [isRecording]);

	// 시간 포맷팅 (00:00)
	const formatTime = (totalSeconds: number) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	// 마이크 시작/중지
	const handleMicClick = () => {
		if (!isRecording) {
			setIsRecording(true);
		} else {
			if (recordRef.current) {
				recordRef.current.stopRecording();
				recordRef.current.stopMic();
			}
			setIsRecording(false);
		}
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
					className="px-5 w-full h-[291px]"
					style={{
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
							<div
								ref={waveformRef}
								className="flex-1 h-6 overflow-hidden"
								style={{
									width: "208px",
									// backgroundImage: "radial-gradient(circle at center, #D1D5DB 1.25px, transparent 1.25px)",
									// backgroundSize: "4.5px 100%",
									// backgroundPosition: "center",
									// backgroundRepeat: "repeat-x",
								}}
							/>
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
