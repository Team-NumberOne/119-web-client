"use client";

import { useEffect, useRef, useState } from "react";

interface UseCarouselOptions<T> {
	items: T[];
	onSelect?: (item: T) => void;
}

export function useCarousel<T extends { id: string }>({
	items,
	onSelect,
}: UseCarouselOptions<T>) {
	const [currentIndex, setCurrentIndex] = useState(0);
	const onSelectRef = useRef(onSelect);
	const isInitialMount = useRef(true);

	// onSelect의 최신 값을 ref에 저장
	useEffect(() => {
		onSelectRef.current = onSelect;
	}, [onSelect]);

	const currentItem = items?.[currentIndex];

	// currentIndex가 변경될 때만 상위로 전달 (초기 마운트 제외)
	useEffect(() => {
		// 초기 마운트 시에는 실행하지 않음
		if (isInitialMount.current) {
			isInitialMount.current = false;
			return;
		}

		if (currentItem && onSelectRef.current) {
			onSelectRef.current(currentItem);
		}
	}, [currentItem]);

	const handlePrevious = () => {
		setCurrentIndex((prev) => {
			const newIndex = prev === 0 ? items.length - 1 : prev - 1;
			const newItem = items[newIndex];
			if (newItem) {
				onSelect?.(newItem);
			}
			return newIndex;
		});
	};

	const handleNext = () => {
		setCurrentIndex((prev) => {
			const newIndex = prev === items.length - 1 ? 0 : prev + 1;
			const newItem = items[newIndex];
			if (newItem) {
				onSelect?.(newItem);
			}
			return newIndex;
		});
	};

	const handleDotClick = (index: number) => {
		setCurrentIndex(index);
		const item = items[index];
		if (item) {
			onSelect?.(item);
		}
	};

	return {
		currentIndex,
		currentItem,
		handlePrevious,
		handleNext,
		handleDotClick,
	};
}
