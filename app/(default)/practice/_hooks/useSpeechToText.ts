"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechToTextOptions {
	isRecording: boolean;
	language?: string;
}

export function useSpeechToText({
	isRecording,
	language = "ko-KR",
}: UseSpeechToTextOptions) {
	const [transcript, setTranscript] = useState<string>("");
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	useEffect(() => {
		// isRecording이 false일 때는 초기화하지 않음 (권한 요청 방지)
		if (!isRecording) {
			return;
		}

		// Web Speech API 지원 확인
		if (
			typeof window === "undefined" ||
			(!("webkitSpeechRecognition" in window) &&
				!("SpeechRecognition" in window))
		) {
			console.warn("[STT] Speech Recognition API를 지원하지 않습니다.");
			return;
		}

		const SpeechRecognition =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognition) {
			return;
		}

		const recognition = new SpeechRecognition();
		recognition.continuous = true; // 연속 인식
		recognition.interimResults = true; // 중간 결과도 받기
		recognition.lang = language;

		recognition.onstart = () => {
			console.log("[STT] 음성 인식 시작");
			setIsListening(true);
		};

		recognition.onresult = (event) => {
			let interimTranscript = "";
			let finalTranscript = "";

			for (let i = event.resultIndex; i < event.results.length; i++) {
				const transcript = event.results[i][0].transcript;
				if (event.results[i].isFinal) {
					finalTranscript += `${transcript} `;
				} else {
					interimTranscript += transcript;
				}
			}

			setTranscript((prev) => {
				// 이전 최종 텍스트에 새로운 최종 텍스트 추가
				const newFinal = prev.replace(/[^\s]+$/, "") + finalTranscript;
				// 중간 결과 추가
				const result = newFinal + interimTranscript;
				console.log("[STT] 텍스트 업데이트:", {
					finalTranscript,
					interimTranscript,
					result,
				});
				return result;
			});
		};

		recognition.onerror = (event) => {
			// aborted 에러는 정상적인 중단이므로 무시
			if (event.error === "aborted") {
				console.log("[STT] 음성 인식 중단됨");
				return;
			}
			// no-speech 에러도 무시 (음성이 없어도 계속 인식)
			if (event.error === "no-speech") {
				return;
			}
			console.error("[STT] 음성 인식 오류:", event.error);
		};

		recognition.onend = () => {
			console.log("[STT] 음성 인식 종료");
			setIsListening(false);
			// 녹음 중이고 아직 recognition이 유효하면 다시 시작
			if (isRecording && recognitionRef.current === recognition) {
				// 약간의 지연 후 재시작 (브라우저가 완전히 정리할 시간을 줌)
				setTimeout(() => {
					if (isRecording && recognitionRef.current === recognition) {
						try {
							recognition.start();
						} catch (error) {
							// aborted 에러는 무시
							if (error instanceof Error && error.message.includes("aborted")) {
								return;
							}
							console.warn("[STT] 재시작 오류:", error);
						}
					}
				}, 100);
			}
		};

		recognitionRef.current = recognition;

		// isRecording이 true일 때만 시작
		try {
			recognition.start();
		} catch (error) {
			console.warn("[STT] 시작 오류:", error);
		}

		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (error) {
					console.warn("[STT] 정리 오류:", error);
				}
				recognitionRef.current = null;
			}
			setIsListening(false);
		};
	}, [isRecording, language]);

	// isRecording이 false일 때 transcript 초기화
	useEffect(() => {
		if (!isRecording) {
			setTranscript("");
		}
	}, [isRecording]);

	return {
		transcript,
		isListening,
		resetTranscript: useCallback(() => {
			setTranscript("");
		}, []),
	};
}
