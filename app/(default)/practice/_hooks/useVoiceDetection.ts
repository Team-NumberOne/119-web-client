"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Detect } from "web-voice-detection";

const DEFAULT_SILENCE_DURATION_MS = 1500; // 기본 1.5초
const SPEECH_THRESHOLD = 0.7; // 일상 소음 필터링을 위한 임계값
const MIN_SPEECH_FRAMES = 3; // 최소 연속 음성 프레임 수

interface UseVoiceDetectionOptions {
	isRecording: boolean;
	onAutoPause: () => void;
	silenceDurationMs?: number; // 무음 감지 시간 (기본 1500ms)
}

export function useVoiceDetection({
	isRecording,
	onAutoPause,
	silenceDurationMs = DEFAULT_SILENCE_DURATION_MS,
}: UseVoiceDetectionOptions) {
	const detectRef = useRef<Detect | null>(null);
	const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const frameCountRef = useRef<number>(0);
	const streamRef = useRef<MediaStream | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const speechFrameCountRef = useRef<number>(0); // 연속 음성 프레임 카운터
	const isInitializingRef = useRef<boolean>(false); // 초기화 중 플래그
	const onAutoPauseRef = useRef(onAutoPause);
	const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

	// onAutoPause ref 업데이트
	useEffect(() => {
		onAutoPauseRef.current = onAutoPause;
	}, [onAutoPause]);

	// Voice Detection 정리 함수
	const cleanup = useCallback(() => {
		console.log("[Voice Detection] cleanup 호출");
		isInitializingRef.current = false;

		// 타이머 정리
		if (silenceTimerRef.current) {
			console.log("[Voice Detection] 타이머 정리");
			clearTimeout(silenceTimerRef.current);
			silenceTimerRef.current = null;
		}

		// detect 정리 (먼저 정리하여 프레임 처리가 중지되도록)
		if (detectRef.current) {
			try {
				console.log("[Voice Detection] detect destroy 시작", {
					listening: detectRef.current.listening,
				});
				detectRef.current.destroy();
				console.log("[Voice Detection] detect destroy 완료");
			} catch (error) {
				if (error instanceof Error && error.name === "InvalidStateError") {
					console.log("[Voice Detection] AudioContext 이미 닫혀있음");
				} else {
					console.warn("[Voice Detection] detect destroy 오류:", error);
				}
			}
			detectRef.current = null;
		}

		// 스트림 정리
		if (streamRef.current) {
			console.log("[Voice Detection] 스트림 정리");
			streamRef.current.getTracks().forEach((track) => {
				track.stop();
			});
			streamRef.current = null;
		}

		analyserNodeRef.current = null;
		setAnalyserNode(null);
		frameCountRef.current = 0;
		speechFrameCountRef.current = 0;
		console.log("[Voice Detection] cleanup 완료");
	}, []);

	// 마이크 및 Voice Detection 초기화
	// biome-ignore lint/correctness/useExhaustiveDependencies: cleanup은 useCallback으로 메모이제이션되어 안정적이므로 의존성 제외
	useEffect(() => {
		if (!isRecording) {
			// 녹음 중지 시 정리
			if (detectRef.current || streamRef.current) {
				console.log(
					"[Voice Detection] isRecording이 false로 변경됨 - cleanup 호출",
				);
				cleanup();
			}
			isInitializingRef.current = false;
			return;
		}

		// 이미 초기화 중이거나 완료된 경우 재초기화 방지
		if (isInitializingRef.current || detectRef.current) {
			console.log("[Voice Detection] 이미 초기화됨 - 재초기화 방지", {
				isInitializing: isInitializingRef.current,
				hasDetect: !!detectRef.current,
			});
			return;
		}

		let detectInstance: Detect | null = null;
		isInitializingRef.current = true;

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
									console.log(
										`[Voice Detection] ${silenceDurationMs}ms 경과 - 자동 일시정지`,
									);
									onAutoPauseRef.current();
								}, silenceDurationMs);
							}
						}
					},
					fftSize: 1024,
				});

				detectInstance = detect;
				detectRef.current = detect;
				isInitializingRef.current = false;

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
				isInitializingRef.current = false;
				alert("마이크 접근 권한이 필요합니다.");
			}
		};

		initRecording();

		return () => {
			console.log("[Cleanup] useEffect cleanup 시작");
			isInitializingRef.current = false;

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
			if (detectRef.current) {
				try {
					// detectInstance와 비교하지 않고 무조건 destroy 시도
					// (cleanup 함수에서 호출되는 경우 detectInstance가 없을 수 있음)
					if (detectRef.current === detectInstance || !detectInstance) {
						console.log("[Cleanup] detect destroy 시작");
						detectRef.current.destroy();
						console.log("[Cleanup] detect destroy 완료");
					}
				} catch (error) {
					if (error instanceof Error && error.name === "InvalidStateError") {
						console.log("[Cleanup] AudioContext 이미 닫혀있음");
					} else {
						console.warn("[Cleanup] detect destroy 오류:", error);
					}
				}
				detectRef.current = null;
			}
			analyserNodeRef.current = null;
			setAnalyserNode(null);

			// 프레임 카운터 리셋
			frameCountRef.current = 0;
			speechFrameCountRef.current = 0;

			console.log("[Cleanup] useEffect cleanup 완료");
		};
		// cleanup은 useCallback으로 메모이제이션되어 있고 의존성이 없어 안정적이므로 제외
		// onAutoPause는 ref로 관리하므로 제외
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isRecording, silenceDurationMs]);

	return {
		analyserNode,
		cleanup,
	};
}
