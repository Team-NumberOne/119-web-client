"use client";

import { Icons } from "@team-numberone/daepiro-design-system";
import type { DetailSituation } from "../../../constants/detailSituations";

interface DetailSituationCardProps {
	situation: DetailSituation;
	onClick?: () => void;
}

export function DetailSituationCard({
	situation,
	onClick,
}: DetailSituationCardProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-full max-w-[320px] bg-white rounded-[20px] pt-6 pr-[14px] pb-[14px] pl-6 flex flex-col justify-center items-end gap-3 border-2 border-[#EEEFF2]"
		>
			<div className="text-left w-full">
				<div className="text-primary-400 text-h5">{situation.location}</div>
				<div className="text-gray-700 text-h5">{situation.description}</div>
			</div>
			<Icons.Start
				size={32}
				color="var(--color-gray-300)"
				className="shrink-0"
			/>
		</button>
	);
}
