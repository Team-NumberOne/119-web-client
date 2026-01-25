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
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
				animationFrameRef.current = null;
			}
			waveformDataRef.current = [];
			frameSkipCounterRef.current = 0;

			const canvas = canvasRef.current;
			const ctx = canvas?.getContext("2d");
			if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
			return;
		}

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.width = width;
		canvas.height = height;

		const barWidth = 2;
		const barGap = 2;
		const barCount = Math.floor(width / (barWidth + barGap));

		if (waveformDataRef.current.length === 0) {
			waveformDataRef.current = new Array(barCount).fill(0);
		}

		const drawWaveform = () => {
			if (!isActive || !analyserNode) return;

			const bufferLength = analyserNode.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);
			analyserNode.getByteFrequencyData(dataArray);

			frameSkipCounterRef.current++;

			if (frameSkipCounterRef.current >= 3) {
				frameSkipCounterRef.current = 0;

				let sum = 0;
				for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
				const averageLevel = sum / dataArray.length / 255;

				waveformDataRef.current.push(averageLevel);
				if (waveformDataRef.current.length > barCount) {
					waveformDataRef.current.shift();
				}
			}

			ctx.clearRect(0, 0, width, height);
			ctx.fillStyle = barColor;

			for (let i = 0; i < waveformDataRef.current.length; i++) {
				const normalizedValue = waveformDataRef.current[i];
				const x = i * (barWidth + barGap);

				if (normalizedValue < 0.01) {
					const dotSize = 2.5;
					const dotX = x + (barWidth - dotSize) / 2;
					const dotY = (height - dotSize) / 2;
					ctx.fillRect(dotX, dotY, dotSize, dotSize);
				} else if (normalizedValue >= 0.5) {
					ctx.fillRect(x, 0, barWidth, height);
				} else {
					const percentage = normalizedValue / 0.5;
					const barHeight = percentage * height;
					const y = (height - barHeight) / 2;
					ctx.fillRect(x, y, barWidth, barHeight);
				}
			}

			animationFrameRef.current = requestAnimationFrame(drawWaveform);
		};

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
			style={{ width: `${width}px`, height: `${height}px` }}
		/>
	);
}
