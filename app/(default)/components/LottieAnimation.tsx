"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { useEffect, useRef } from "react";

interface LottieAnimationProps {
	animationData: unknown;
	width?: number;
	height?: number;
	loop?: boolean;
	autoplay?: boolean;
	className?: string;
}

export function LottieAnimation({
	animationData,
	width = 200,
	height = 200,
	loop = true,
	autoplay = true,
	className,
}: LottieAnimationProps) {
	const lottieRef = useRef<LottieRefCurrentProps>(null);

	useEffect(() => {
		if (lottieRef.current && autoplay) {
			lottieRef.current.play();
		}
	}, [autoplay]);

	return (
		<div className={className} style={{ width, height }}>
			<Lottie
				lottieRef={lottieRef}
				animationData={animationData}
				loop={loop}
				autoplay={autoplay}
				style={{ width: "100%", height: "100%" }}
			/>
		</div>
	);
}
