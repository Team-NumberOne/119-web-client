"use client";

import { useState } from "react";
import { EmergencySituationCarousel } from "./components/EmergencySituationCarousel";
import { PracticeSectionHeader } from "./components/PracticeSectionHeader";
import { RandomPracticeCTA } from "./components/RandomPracticeCTA";
import { StartPracticeButton } from "./components/StartPracticeButton";
import { practiceItems } from "./constants/practiceItems";

export default function HomePage() {
	const [selectedSituationId, setSelectedSituationId] = useState<string>(
		practiceItems[0]?.id || "",
	);

	return (
		<div className="h-full overflow-hidden flex flex-col">
			{/* 그라디언트 섹션 */}
			<div className="bg-green-gradient flex-76 pb-[20px] rounded-b-3xl shadow-layered overflow-hidden flex flex-col">
				<PracticeSectionHeader />

				{/* 캐러셀: 남는 세로 공간 먹기 */}
				<div className="flex-1 min-h-0 flex">
					<EmergencySituationCarousel
						items={practiceItems}
						onSelect={setSelectedSituationId}
					/>
				</div>

				<StartPracticeButton situationId={selectedSituationId} />
			</div>

			<RandomPracticeCTA />
		</div>
	);
}
