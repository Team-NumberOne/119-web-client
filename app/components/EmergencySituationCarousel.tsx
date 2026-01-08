"use client";

import { Icons } from "@team-numberone/daepiro-design-system";
import { useState } from "react";

interface CarouselItem {
	id: string;
	tag: string;
	title: string;
	character?: React.ReactNode;
}

interface EmergencySituationCarouselProps {
	items: CarouselItem[];
}

export function EmergencySituationCarousel({
	items,
}: EmergencySituationCarouselProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	// 안전장치: items가 비어있으면 렌더링 X
	if (!items || items.length === 0) return null;

	const handlePrevious = () => {
		setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
	};

	const handleNext = () => {
		setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
	};

	const currentItem = items[currentIndex];

	return (
		<div className="w-full flex flex-col flex-1 min-h-0">
			{/* 캐러셀 영역(남는 세로 공간을 카드가 먹는 영역) */}
			<div className="relative flex-1 min-h-0 flex items-stretch justify-center my-[clamp(8px,2.7svh,1.25rem)]">
				{/* 이전 버튼 */}
				<button
					type="button"
					onClick={handlePrevious}
					className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center"
					aria-label="이전"
				>
					<Icons.ArrowLeft size={24} color="var(--color-gray-500)" />
				</button>

				{/* 캐러셀 카드 */}
				<div className="max-w-[280px] w-full mx-[54px] bg-white rounded-[20px] border-2 border-solid border-white px-5 py-6 h-full">
					{/* (선택) 캐릭터/일러스트 */}
					{currentItem.character ? (
						<div className="flex justify-center mb-3">
							{currentItem.character}
						</div>
					) : null}

					<div className="text-center mb-2">
						<span className="inline-block px-[6px] py-1 bg-green-50 text-green-500 rounded-[6px] text-caption">
							{currentItem.tag}
						</span>
					</div>

					<div className="text-center">
						<h3 className="text-h6 text-gray-600">{currentItem.title}</h3>
					</div>
				</div>

				{/* 다음 버튼 */}
				<button
					type="button"
					onClick={handleNext}
					className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-6 h-6 flex items-center justify-center"
					aria-label="다음"
				>
					<Icons.ArrowRight size={24} color="var(--color-gray-500)" />
				</button>
			</div>

			{/* 페이지네이션 도트 (아래 고정) */}
			<div className="flex justify-center gap-1 mb-[clamp(8px,2.7svh,1.25rem)] shrink-0">
				{items.map((item, index) => (
					<button
						key={item.id}
						type="button"
						onClick={() => setCurrentIndex(index)}
						className={`w-[6px] h-[6px] rounded-full ${
							index === currentIndex ? "bg-gray-500" : "bg-gray-100"
						}`}
						aria-label={`${index + 1}번 항목으로 이동`}
					/>
				))}
			</div>
		</div>
	);
}
