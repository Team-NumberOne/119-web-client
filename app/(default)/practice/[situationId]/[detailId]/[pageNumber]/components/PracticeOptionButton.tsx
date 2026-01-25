"use client";

import { Button, Modal } from "@team-numberone/daepiro-design-system";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LottieAnimation } from "./LottieAnimation";

interface PracticeOptionButtonProps {
	children: React.ReactNode;
	isCorrect?: boolean;
	pageNumber: number;
	situationId: string;
	detailId: string;
	incorrectFeedback?: string;
	onClick?: () => void;
}

export function PracticeOptionButton({
	children,
	isCorrect,
	pageNumber,
	situationId,
	detailId,
	incorrectFeedback,
	onClick,
}: PracticeOptionButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [showLottie, setShowLottie] = useState(false);
	const [animationData, setAnimationData] = useState<unknown>(null);
	const router = useRouter();

	useEffect(() => {
		if (showLottie && animationData) {
			const timer = setTimeout(() => {
				setShowLottie(false);
				// 1번 페이지에서 정답이면 2번 페이지로 이동
				if (pageNumber === 1 && isCorrect) {
					router.push(`/practice/${situationId}/${detailId}/2`);
				}
				// 2번 페이지에서 정답이면 다이얼 페이지로 이동
				if (pageNumber === 2 && isCorrect) {
					router.push(`/practice/${situationId}/${detailId}/dial`);
				}
			}, 2000);

			return () => clearTimeout(timer);
		}
	}, [
		showLottie,
		animationData,
		pageNumber,
		isCorrect,
		situationId,
		detailId,
		router,
	]);

	const handleClick = async () => {
		onClick?.();

		// 정답인 경우 (1번 또는 2번 페이지)
		if (isCorrect) {
			try {
				const response = await fetch("/popup/correct.json");
				const data = await response.json();
				setAnimationData(data);
				setShowLottie(true);
			} catch (error) {
				console.error("Failed to load correct animation:", error);
				// 애니메이션 로드 실패 시 바로 이동
				if (pageNumber === 1) {
					router.push(`/practice/${situationId}/${detailId}/2`);
				} else if (pageNumber === 2) {
					router.push(`/practice/${situationId}/${detailId}/dial`);
				}
			}
		} else {
			// 오답인 경우 모달 표시
			setIsModalOpen(true);
		}
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
	};

	// 오답 애니메이션 로드
	useEffect(() => {
		if (isModalOpen && !isCorrect) {
			const loadAnimation = async () => {
				try {
					const response = await fetch("/popup/incorrect.json");
					const data = await response.json();
					setAnimationData(data);
				} catch (error) {
					console.error("Failed to load incorrect animation:", error);
				}
			};
			loadAnimation();
		}
	}, [isModalOpen, isCorrect]);

	return (
		<>
			<Button
				full
				onClick={handleClick}
				className="rounded-[12px] bg-white border-2 border-solid border-gray-75 font-bold text-gray-500"
			>
				{children}
			</Button>

			{/* 정답 시 로티 오버레이 (1번 또는 2번 페이지) */}
			{showLottie && animationData && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<LottieAnimation
						animationData={animationData}
						width={150}
						height={150}
						loop={false}
					/>
				</div>
			)}

			{/* 오답 모달 */}
			<Modal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				showCloseButton={false}
				actionButton={{
					label: "다시 선택하기",
					onClick: handleCloseModal,
				}}
			>
				<div className="flex flex-col items-center gap-4">
					{animationData ? (
						<LottieAnimation
							animationData={animationData}
							width={100}
							height={100}
							loop={false}
						/>
					) : null}
					{incorrectFeedback && (
						<p className="text-body-1 text-gray-700 text-center">
							{incorrectFeedback.split("<br />").map((line, index, array) => (
								<span key={line}>
									{line}
									{index < array.length - 1 && <br />}
								</span>
							))}
						</p>
					)}
				</div>
			</Modal>
		</>
	);
}
