"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconWrapper } from "@/components/icons/IconWrapper";
import { CallEndPopup } from "./components/CallEndPopup";

const QUESTIONS = [
	"어떤 일이 발생했나요?",
	"그 위치가 어디인가요?",
	"현재 상황을 더 자세히 설명해주세요.",
	"위험한 요소가 더 있나요?",
	"추가로 알려주실 것이 있나요?",
];

export default function CallPage() {
	const [seconds, setSeconds] = useState(0);
	const [currentQuestionIndex] = useState(0);
	const [showEndPopup] = useState(false);
	const [reportId] = useState<number | null>(null);
	const params = useParams();
	const router = useRouter();
	const detailId = (params.detailId as string) || "";
	const situationId = params.situationId as string;

	// detailId가 없으면 기본값 설정 (랜덤 연습 등에서 직접 접근한 경우)
	useEffect(() => {
		if (!detailId && situationId) {
			// situationId에 해당하는 첫 번째 detailId로 리다이렉트
			import("../../../../_constants/detailSituations").then(
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
			</div>

			{/* 전화 종료 팝업 */}
			{reportId !== null && (
				<CallEndPopup
					isOpen={showEndPopup}
					onViewResult={() => {
						router.push(`/report/${reportId}`);
					}}
				/>
			)}
		</div>
	);
}
