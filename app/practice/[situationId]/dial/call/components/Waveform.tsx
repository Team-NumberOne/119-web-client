"use client";

import { useEffect, useRef } from "react";

interface WaveformProps {
	analyserNode: AnalyserNode | null;
	isActive: boolean;
	width?: number;
	height?: number;
	barColor?: string;
}

export function Waveform({
	analyserNode,
	isActive,
	width = 208,
	height = 24,
	barColor = "#D1D5DB",
}: WaveformProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationFrameRef = useRef<number | null>(null);
	const waveformDataRef = useRef<number[]>([]);
	const frameSkipCounterRef = useRef<number>(0);

	useEffect(() => {
		if (!isActive || !analyserNode || !canvasRef.current) {
			// 애니메이션 중지 및 데이터 초기화
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			waveformDataRef.current = [];
			frameSkipCounterRef.current = 0;
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Canvas 크기 설정
		canvas.width = width;
		canvas.height = height;

		// 파형 데이터 초기화
		const barWidth = 2;
		const barGap = 2;
		const barCount = Math.floor(width / (barWidth + barGap));

		// 초기 데이터 배열 (모두 0으로 시작)
		if (waveformDataRef.current.length === 0) {
			waveformDataRef.current = new Array(barCount).fill(0);
		}

		const drawWaveform = () => {
			if (!isActive || !analyserNode || !canvas) return;

			const bufferLength = analyserNode.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			analyserNode.getByteFrequencyData(dataArray);

			// 프레임 스킵 카운터 증가 (더 천천히 스크롤되도록)
			frameSkipCounterRef.current++;

			// 3프레임마다 한 번씩만 데이터 추가 (더 천천히 이동)
			if (frameSkipCounterRef.current >= 3) {
				frameSkipCounterRef.current = 0;

				// 현재 프레임의 평균 레벨 계산
				let sum = 0;
				for (let i = 0; i < dataArray.length; i++) {
					sum += dataArray[i];
				}
				const averageLevel = sum / dataArray.length / 255; // 0-1 범위로 정규화

				// 새로운 데이터를 오른쪽에 추가하고, 왼쪽으로 이동
				waveformDataRef.current.push(averageLevel);
				if (waveformDataRef.current.length > barCount) {
					waveformDataRef.current.shift(); // 가장 오래된 데이터 제거
				}
			}

			// 배경 지우기
			ctx.clearRect(0, 0, width, height);

			// 파형 그리기 (오른쪽에서 왼쪽으로)
			ctx.fillStyle = barColor;

			for (let i = 0; i < waveformDataRef.current.length; i++) {
				const normalizedValue = waveformDataRef.current[i];
				const x = i * (barWidth + barGap);

				if (normalizedValue === 0 || normalizedValue < 0.01) {
					// 볼륨 0일 때 점으로 표시 (2.5x2.5)
					const dotSize = 2.5;
					const dotX = x + (barWidth - dotSize) / 2;
					const dotY = (height - dotSize) / 2;
					ctx.fillRect(dotX, dotY, dotSize, dotSize);
				} else if (normalizedValue >= 0.5) {
					// 볼륨 5 이상 (50% 이상)일 때 최대 높이 24px
					const y = 0;
					ctx.fillRect(x, y, barWidth, height);
				} else {
					// 볼륨 0~5 사이 (0~50%): 백분율에 따라 점에서 높이 24px까지 선형 보간
					// normalizedValue가 0~0.5 사이를 0~1로 매핑하여 높이 계산
					const percentage = normalizedValue / 0.5; // 0~1 범위로 변환
					const barHeight = percentage * height; // 점(0)에서 최대 높이(24)까지
					const y = (height - barHeight) / 2;
					ctx.fillRect(x, y, barWidth, barHeight);
				}
			}

			// 다음 프레임 요청
			animationFrameRef.current = requestAnimationFrame(drawWaveform);
		};

		// 파형 그리기 시작
		drawWaveform();

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
		};
	}, [analyserNode, isActive, width, height, barColor]);

	return (
		<canvas
			ref={canvasRef}
			className="flex-1 h-6"
			style={{
				width: `${width}px`,
				height: `${height}px`,
			}}
		/>
	);
}
