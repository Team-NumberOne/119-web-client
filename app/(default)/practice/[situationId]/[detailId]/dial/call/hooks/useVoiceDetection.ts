"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Detect } from "web-voice-detection";

const SILENCE_DURATION_MS = 3000; // 3초
const SPEECH_THRESHOLD = 0.7; // 일상 소음 필터링을 위한 임계값
const MIN_SPEECH_FRAMES = 3; // 최소 연속 음성 프레임 수

interface UseVoiceDetectionOptions {
	isRecording: boolean;
	onAutoPause: () => void;
}

export function useVoiceDetection({
	isRecording,
	onAutoPause,
}: UseVoiceDetectionOptions) {
	const detectRef = useRef<Detect | null>(null);
	const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const frameCountRef = useRef<number>(0);
	const streamRef = useRef<MediaStream | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const speechFrameCountRef = useRef<number>(0); // 연속 음성 프레임 카운터
	const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

	// Voice Detection 정리 함수
	const cleanup = useCallback(() => {
		// 타이머 정리
		if (silenceTimerRef.current) {
			clearTimeout(silenceTimerRef.current);
			silenceTimerRef.current = null;
		}

		// 스트림 정리
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => {
				track.stop();
			});
			streamRef.current = null;
		}

		// detect 정리
		if (detectRef.current) {
			try {
				detectRef.current.destroy();
			} catch (error) {
				if (error instanceof Error && error.name === "InvalidStateError") {
					console.log("[Voice Detection] AudioContext 이미 닫혀있음");
				} else {
					console.warn("[Voice Detection] detect destroy 오류:", error);
				}
			}
			detectRef.current = null;
		}

		analyserNodeRef.current = null;
		setAnalyserNode(null);
		frameCountRef.current = 0;
		speechFrameCountRef.current = 0;
	}, []);

	// 마이크 및 Voice Detection 초기화
	useEffect(() => {
		if (!isRecording) {
			cleanup();
			return;
		}

		let detectInstance: Detect | null = null;

		const initRecording = async () => {
			try {
				console.log("[Voice Detection] 마이크 시작");
				// 마이크 스트림 가져오기
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				streamRef.current = stream;
				console.log("[Voice Detection] 스트림 획득 성공");

				// web-voice-detection 초기화
				console.log("[Voice Detection] 초기화 시작...");
				const detect = await Detect.new({
					stream,
					workletURL: "/worklet.js",
					modelURL: "/model.onnx",
					onSpeechStart: () => {
						console.log("[Voice Detection] 음성 감지 시작");
						if (silenceTimerRef.current) {
							console.log("[Voice Detection] 타이머 리셋");
							clearTimeout(silenceTimerRef.current);
							silenceTimerRef.current = null;
						}
					},
					onSpeechEnd: (audio) => {
						console.log("[Voice Detection] 음성 종료", {
							audioLength: audio?.length,
						});
					},
					onMisfire: () => {
						console.log("[Voice Detection] Misfire - 짧은 음성 감지");
					},
					onFrameProcessed: (frame) => {
						// 일상 소음 필터링: 임계값을 높여서 더 확실한 음성만 감지
						const isSpeech = frame.probabilities.isSpeech > SPEECH_THRESHOLD;

						frameCountRef.current++;

						// 디버깅 로그는 처음 10개만 출력
						if (frameCountRef.current <= 10) {
							const speechProb = frame.probabilities.isSpeech;
							const notSpeechProb = frame.probabilities.notSpeech;
							console.log("[Voice Detection] 프레임 처리", {
								frameCount: frameCountRef.current,
								isSpeech,
								speechProb: speechProb.toFixed(3),
								notSpeechProb: notSpeechProb.toFixed(3),
								hasTimer: !!silenceTimerRef.current,
								speechFrameCount: speechFrameCountRef.current,
							});
						}

						if (isSpeech) {
							// 연속 음성 프레임 카운터 증가
							speechFrameCountRef.current++;

							// 최소 3프레임 이상 연속으로 음성이 감지되어야 실제 음성으로 인정
							// (일상 소음은 보통 짧게 나타나므로)
							if (speechFrameCountRef.current >= MIN_SPEECH_FRAMES) {
								// 음성 감지 시 타이머가 있으면 리셋
								if (silenceTimerRef.current) {
									clearTimeout(silenceTimerRef.current);
									silenceTimerRef.current = null;
								}
							}
						} else {
							// 음성이 아니면 연속 프레임 카운터 리셋
							speechFrameCountRef.current = 0;

							// 조용함 감지 시 타이머가 없으면 시작
							if (!silenceTimerRef.current) {
								silenceTimerRef.current = setTimeout(() => {
									console.log("[Voice Detection] 3초 경과 - 자동 일시정지");
									onAutoPause();
								}, SILENCE_DURATION_MS);
							}
						}
					},
					fftSize: 1024,
				});

				detectInstance = detect;
				detectRef.current = detect;

				console.log("[Voice Detection] 초기화 완료", {
					listening: detect.listening,
					analyserNode: detect.analyserNode,
				});

				if (!detect.listening) {
					console.log("[Voice Detection] start() 호출 중...");
					detect.start();
					console.log("[Voice Detection] start() 호출 완료", {
						listening: detect.listening,
					});
				}

				// AnalyserNode 저장
				if (detect.analyserNode) {
					analyserNodeRef.current = detect.analyserNode;
					setAnalyserNode(detect.analyserNode);
					frameCountRef.current = 0;
					speechFrameCountRef.current = 0;
					console.log("[Waveform] AnalyserNode 설정 완료", detect.analyserNode);
				} else {
					console.warn("[Waveform] AnalyserNode가 없습니다");
				}
			} catch (error) {
				console.error("[Voice Detection] 초기화 오류:", error);
				alert("마이크 접근 권한이 필요합니다.");
			}
		};

		initRecording();

		return () => {
			console.log("[Cleanup] useEffect cleanup 시작");

			// 타이머 정리
			if (silenceTimerRef.current) {
				clearTimeout(silenceTimerRef.current);
				silenceTimerRef.current = null;
			}

			// 스트림 정리
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => {
					track.stop();
				});
				streamRef.current = null;
			}

			// detect 정리 (detectRef.current가 아직 존재하는 경우에만)
			// handleMicClick이나 handleAutoPause에서 이미 정리했을 수 있음
			if (detectRef.current && detectRef.current === detectInstance) {
				try {
					detectInstance.destroy();
				} catch (error) {
					if (error instanceof Error && error.name === "InvalidStateError") {
						console.log("[Cleanup] AudioContext 이미 닫혀있음");
					} else {
						console.warn("[Cleanup] detect destroy 오류:", error);
					}
				}
			}
			detectRef.current = null;
			analyserNodeRef.current = null;
			setAnalyserNode(null);

			// 프레임 카운터 리셋
			frameCountRef.current = 0;
			speechFrameCountRef.current = 0;

			console.log("[Cleanup] useEffect cleanup 완료");
		};
	}, [isRecording, onAutoPause, cleanup]);

	return {
		analyserNode,
		cleanup,
	};
}
