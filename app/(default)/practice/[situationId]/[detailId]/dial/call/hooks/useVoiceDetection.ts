"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Detect } from "web-voice-detection";

const SILENCE_DURATION_MS = 3000; // 3초
const SPEECH_THRESHOLD = 0.7; // 일상 소음 필터링 임계값
const MIN_SPEECH_FRAMES = 3; // 최소 연속 음성 프레임 수

// ✅ maxAlternatives 타입 누락 보강
type SpeechRecognitionWithMaxAlt = SpeechRecognition & {
	maxAlternatives?: number;
};

// ✅ onerror 이벤트 타입 보강
type SpeechRecognitionErrorEventLike = Event & { error?: string };

interface UseVoiceDetectionOptions {
	isRecording: boolean;
	onAutoPause: () => void;
	onSpeechEnd?: (finalTranscript: string) => void; // ✅ 최종 transcript 전달
	onSpeechResult?: (transcript: string) => void;
}

export function useVoiceDetection({
	isRecording,
	onAutoPause,
	onSpeechEnd,
	onSpeechResult,
}: UseVoiceDetectionOptions) {
	const detectRef = useRef<Detect | null>(null);
	const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const frameCountRef = useRef<number>(0);
	const streamRef = useRef<MediaStream | null>(null);
	const analyserNodeRef = useRef<AnalyserNode | null>(null);
	const speechFrameCountRef = useRef<number>(0);

	const recognitionRef = useRef<SpeechRecognition | null>(null);

	// ✅ STT 관련 refs (onend 누락 대비)
	const transcriptRef = useRef<string>("");
	const pendingFinalizeRef = useRef<boolean>(false);

	const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

	const cleanup = useCallback(() => {
		// SpeechRecognition 정리
		if (recognitionRef.current) {
			try {
				recognitionRef.current.onresult = null;
				recognitionRef.current.onerror = null;
				recognitionRef.current.onend = null;
				recognitionRef.current.stop();
			} catch {
				// ignore
			}
			recognitionRef.current = null;
		}

		pendingFinalizeRef.current = false;
		transcriptRef.current = "";

		// 타이머 정리
		if (silenceTimerRef.current) {
			clearTimeout(silenceTimerRef.current);
			silenceTimerRef.current = null;
		}

		// stream 정리
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((t) => {
				t.stop();
			});
			streamRef.current = null;
		}

		// detect 정리
		if (detectRef.current) {
			try {
				detectRef.current.destroy();
			} catch (error) {
				if (error instanceof Error && error.name === "InvalidStateError") {
					console.log("[Voice Detection] AudioContext 이미 닫힘");
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

	useEffect(() => {
		if (!isRecording) {
			// 녹음이 꺼지면 리소스 정리
			cleanup();
			return;
		}

		let detectInstance: Detect | null = null;

		// ✅ SpeechRecognition 초기화
		const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
		if (SR) {
			const recognition = new SR();
			recognition.lang = "ko-KR";
			recognition.interimResults = false;
			(recognition as SpeechRecognitionWithMaxAlt).maxAlternatives = 1;

			recognition.onresult = (event: SpeechRecognitionEvent) => {
				const last = event.results[event.results.length - 1];
				const transcript = last?.[0]?.transcript ?? "";
				transcriptRef.current = transcript;
				onSpeechResult?.(transcript);
			};

			recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
				if (event.error === "aborted") {
					console.log("[SpeechRecognition] gracefully aborted");
					return;
				}
				console.error("[SpeechRecognition] Error:", event.error);
			};

			recognition.onend = () => {
				// ✅ stop() 후 onend가 오면 여기서 finalize
				if (!pendingFinalizeRef.current) return;
				pendingFinalizeRef.current = false;
				const finalText = transcriptRef.current.trim();
				onSpeechEnd?.(finalText);
				transcriptRef.current = "";
			};

			recognitionRef.current = recognition;
		} else {
			console.warn("[SpeechRecognition] not supported");
		}

		const initRecording = async () => {
			try {
				console.log("[Voice Detection] 마이크 시작");
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				streamRef.current = stream;

				// ✅ STT 시작
				if (recognitionRef.current) {
					try {
						recognitionRef.current.start();
					} catch (e) {
						console.warn("[SpeechRecognition] start failed:", e);
					}
				}

				console.log("[Voice Detection] Detect 초기화 시작...");

				const detect = await Detect.new({
					stream,
					workletURL: "/worklet.js",
					modelURL: "/model.onnx",

					onSpeechStart: () => {
						console.log("[Voice Detection] 음성 감지 시작");

						// 말 시작하면 silence 타이머 해제
						if (silenceTimerRef.current) {
							clearTimeout(silenceTimerRef.current);
							silenceTimerRef.current = null;
						}
					},

					onSpeechEnd: (audio) => {
						console.log("[Voice Detection] 음성 종료", {
							audioLength: audio?.length,
						});

						// ✅ silence 타이머 정리
						if (silenceTimerRef.current) {
							clearTimeout(silenceTimerRef.current);
							silenceTimerRef.current = null;
						}

						const finalize = () => {
							const finalText = transcriptRef.current.trim();
							onSpeechEnd?.(finalText);
							transcriptRef.current = "";
							pendingFinalizeRef.current = false;
						};

						// ✅ onend가 안 오는 브라우저 대비 fallback
						if (recognitionRef.current) {
							pendingFinalizeRef.current = true;

							try {
								recognitionRef.current.stop();
							} catch {
								finalize();
								return;
							}

							setTimeout(() => {
								if (pendingFinalizeRef.current) {
									finalize();
								}
							}, 400);
						} else {
							finalize();
						}
					},

					onMisfire: () => {
						console.log("[Voice Detection] Misfire - 짧은 음성 감지");
					},

					onFrameProcessed: (frame) => {
						const isSpeech = frame.probabilities.isSpeech > SPEECH_THRESHOLD;
						frameCountRef.current++;

						if (frameCountRef.current <= 10) {
							console.log("[Voice Detection] frame", {
								frame: frameCountRef.current,
								isSpeech,
								speechProb: frame.probabilities.isSpeech.toFixed(3),
								notSpeechProb: frame.probabilities.notSpeech.toFixed(3),
								hasTimer: !!silenceTimerRef.current,
								speechFrameCount: speechFrameCountRef.current,
							});
						}

						if (isSpeech) {
							speechFrameCountRef.current++;

							if (speechFrameCountRef.current >= MIN_SPEECH_FRAMES) {
								if (silenceTimerRef.current) {
									clearTimeout(silenceTimerRef.current);
									silenceTimerRef.current = null;
								}
							}
						} else {
							speechFrameCountRef.current = 0;

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

				if (!detect.listening) {
					detect.start();
				}

				if (detect.analyserNode) {
					analyserNodeRef.current = detect.analyserNode;
					setAnalyserNode(detect.analyserNode);
					frameCountRef.current = 0;
					speechFrameCountRef.current = 0;
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
			// 이 effect의 리소스 정리
			// (cleanup이 isRecording=false 때도 호출되지만, 안전하게 중복 정리 가능)
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch {
					// ignore
				}
			}

			if (silenceTimerRef.current) {
				clearTimeout(silenceTimerRef.current);
				silenceTimerRef.current = null;
			}

			if (streamRef.current) {
				streamRef.current.getTracks().forEach((t) => {
					t.stop();
				});
				streamRef.current = null;
			}

			if (detectRef.current && detectRef.current === detectInstance) {
				try {
					detectInstance.destroy();
				} catch (error) {
					if (error instanceof Error && error.name === "InvalidStateError") {
						console.log("[Cleanup] AudioContext 이미 닫힘");
					} else {
						console.warn("[Cleanup] detect destroy 오류:", error);
					}
				}
			}
			detectRef.current = null;
			analyserNodeRef.current = null;
			setAnalyserNode(null);

			frameCountRef.current = 0;
			speechFrameCountRef.current = 0;

			pendingFinalizeRef.current = false;
			transcriptRef.current = "";
		};
	}, [isRecording, onAutoPause, onSpeechEnd, onSpeechResult, cleanup]);

	return {
		analyserNode,
		cleanup, // ✅ CallPage에서 리셋 버튼에 사용
	};
}
