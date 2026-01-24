"use client";

import { useEffect, useState } from "react";

export function useCallTimer() {
	const [seconds, setSeconds] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setSeconds((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	const formatTime = (totalSeconds: number) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	return {
		seconds,
		formattedTime: formatTime(seconds),
	};
}
