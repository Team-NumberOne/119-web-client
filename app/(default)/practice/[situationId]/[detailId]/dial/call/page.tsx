"use client";

import { IconWrapper } from "@/components/icons/IconWrapper";
import { CallEndPopup } from "./components/CallEndPopup";
import { useCallPage } from "./hooks/useCallPage";

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
	} = useCallPage();

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
					className="text-h6 text-gray-600 text-center h-[56px]"
					style={{ marginTop: "clamp(0.75rem, 2vw, 1rem)" }}
					// biome-ignore lint/security/noDangerouslySetInnerHtml: 질문 텍스트에 줄바꿈을 위해 필요
					dangerouslySetInnerHTML={{
						__html: formatQuestion(
							currentQuestion?.question || callScript.start,
						),
					}}
				/>
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
