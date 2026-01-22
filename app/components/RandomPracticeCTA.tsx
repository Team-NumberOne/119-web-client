"use client";

import { useRouter } from "next/navigation";
import {
	detailSituations,
	type SituationId,
} from "@/app/constants/detailSituations";
import { IconWrapper } from "../../components/icons/IconWrapper";
import { PhoneIcon } from "./PhoneIcon";

export function RandomPracticeCTA() {
	const router = useRouter();

	const handleClick = () => {
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

	return (
		<div className="pt-6 px-5 flex-11 flex items-center justify-center">
			<button
				type="button"
				onClick={handleClick}
				className="bg-white w-full rounded-2xl flex gap-3 p-4 items-center max-w-[280px]"
			>
				<div className="bg-primary-400 rounded-full w-8 h-8 flex justify-center items-center shrink-0">
					<PhoneIcon size={20} />
				</div>
				<div className="flex-1 text-left min-w-0">
					<span className="text-caption text-gray-400">
						어떤 상황이 나올지 몰라요!
					</span>
					<br />
					<span className="text-body-1-b text-gray-600">
						실전 처럼 연습하기
					</span>
				</div>
				<IconWrapper
					name="Start"
					size={24}
					color="var(--color-gray-300)"
					className="shrink-0"
				/>
			</button>
		</div>
	);
}
