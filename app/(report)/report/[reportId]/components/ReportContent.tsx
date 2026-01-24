"use client";

import { Button } from "@team-numberone/daepiro-design-system";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "@/app/(default)/practice/_constants/detailSituations";
import { IconWrapper } from "@/components/icons/IconWrapper";
import { useReport } from "../hooks/useReport";
import {
	getItemTitleLabel,
	getProgressBarColor,
	getReportImagePaths,
} from "../utils/reportUtils";

interface ReportContentProps {
	reportId: string;
}

export function ReportContent({ reportId }: ReportContentProps) {
	const { data: result } = useReport(reportId);
	const router = useRouter();

	const imagePath = getReportImagePaths(result.title);

	// 결과지 공유하기
	const handleShare = async () => {
		const shareData = {
			title: `${result.title} - ${result.totalScore}점`,
			text: `119 신고 연습 결과: ${result.title}\n총점: ${result.totalScore}점\n${result.comment}`,
			url: window.location.href,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch (error) {
				// 사용자가 공유를 취소한 경우 무시
				if ((error as Error).name !== "AbortError") {
					console.error("공유 실패:", error);
				}
			}
		} else {
			// Web Share API를 지원하지 않는 경우 클립보드에 복사
			try {
				await navigator.clipboard.writeText(window.location.href);
				alert("링크가 클립보드에 복사되었습니다.");
			} catch (error) {
				console.error("클립보드 복사 실패:", error);
				alert("공유 기능을 사용할 수 없습니다.");
			}
		}
	};

	// 다시하기 (랜덤 연습)
	const handleRetry = () => {
		// 모든 상세상황을 평탄화하여 배열로 만들기
		const allDetailSituations: Array<{
			situationId: SituationId;
			detailId: string;
		}> = [];

		(Object.keys(detailSituations) as SituationId[]).forEach((situationId) => {
			detailSituations[situationId].forEach((detail) => {
				allDetailSituations.push({
					situationId,
					detailId: detail.id,
				});
			});
		});

		// 랜덤으로 하나 선택
		const randomIndex = Math.floor(Math.random() * allDetailSituations.length);
		const selected = allDetailSituations[randomIndex];

		// 다이얼 페이지로 이동
		router.push(`/practice/${selected.situationId}/${selected.detailId}/dial`);
	};

	// 홈으로 돌아가기
	const handleGoHome = () => {
		router.push("/");
	};

	return (
		<div className="px-5">
			{/* 제목 */}
			<div
				className="text-center mb-6"
				style={{
					background:
						"radial-gradient(49.91% 50% at 50% 50.09%, rgba(186, 233, 208, 0.50) 0%, rgba(186, 233, 208, 0.00) 100%)",
				}}
			>
				<div
					className="mb-6 font-black leading-[32px]"
					style={{
						color: "#3A3F52",
						fontSize: "22px",
						fontFamily: "Pretendard",
						fontFeatureSettings: "'liga' off, 'clig' off",
					}}
				>
					{result.title}
				</div>

				{/* 트로피 이미지 */}
				<div className="mb-4 flex justify-center">
					<Image
						src={imagePath}
						alt={result.title}
						width={140}
						height={140}
						className="max-w-[140px] h-auto"
					/>
				</div>

				{/* 점수 배지 */}
				<div className="inline-flex items-center justify-center bg-gray-800 rounded-full px-4 py-1 mb-3">
					<span className="text-body-1 text-white">{result.totalScore}점</span>
				</div>

				{/* 피드백 텍스트 */}
				<div className="text-body-2 text-gray-600 leading-relaxed">
					{result.comment}
				</div>
			</div>

			{/* 파트별 평가 섹션 */}
			<div className="mt-6 mb-4 px-6 py-[22px] bg-white rounded-[20px] border-2 border-solid border-gray-50">
				<div className="text-body-1 text-gray-700 font-bold mb-[22px]">
					파트별 평가
				</div>
				<div className="flex flex-col gap-4">
					{result.itemScores.map((item, index) => {
						const percentage = Math.round(item.score * 100);
						const colorClass = getProgressBarColor(index);
						return (
							<div key={item.title} className="flex flex-col gap-2">
								<div className="flex justify-between items-center">
									<span className="text-body-2 font-bold text-gray-700">
										{getItemTitleLabel(item.title)}
									</span>
									<span className="text-caption text-gray-500">
										{percentage}%
									</span>
								</div>
								<div className="w-full h-4 bg-[#ECECEC] rounded-full overflow-hidden">
									<div
										className={`h-full ${colorClass} rounded-full transition-all`}
										style={{ width: `${percentage}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* 정보 노트 */}
			<div className="flex items-center justify-center gap-[6px] my-6">
				<IconWrapper name="Warning" size={"sm"} color="var(--color-gray-200)" />
				<span className="text-caption text-gray-200">
					한달 뒤 결과지는 삭제합니다.
				</span>
			</div>

			{/* 버튼들 */}
			<div className="flex flex-col gap-3 mt-auto pb-6">
				<div className="flex gap-3">
					<Button className="bg-[#EEEEF3]" onClick={handleShare}>
						<div className="text-body-1 font-bold text-gray-600 w-[130px]">
							결과지 공유하기
						</div>
					</Button>

					<Button
						className="border-2 border-solid border-[#EEEEF3] bg-white"
						full
						onClick={handleRetry}
					>
						<div className="text-body-1 font-bold text-gray-500">다시하기</div>
					</Button>
				</div>
				<Button
					className="w-full bg-green-500 text-white font-bold"
					onClick={handleGoHome}
				>
					홈으로 돌아가기
				</Button>
			</div>
		</div>
	);
}
