/**
 * 음성 파일 재생 방식으로 변경
 * - TTS 대신 미리 녹음된 음성 파일 재생
 * - HTML5 Audio API 사용
 * - Promise 기반 제어로 턴 기반 UX 지원
 */

import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getCallScript } from "../constants/callScript";

export function useCallPage() {
	const [seconds, setSeconds] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [showEndPopup, setShowEndPopup] = useState(false);
	const [reportId] = useState<number | null>(null);
	const params = useParams();
	const router = useRouter();
	const detailId = (params.detailId as string) || "";
	const situationId = params.situationId as string;

	// 콜스크립트 가져오기
	const callScript = getCallScript(detailId);
	const currentQuestion = callScript.questions[currentQuestionIndex];

	// detailId가 없으면 기본값 설정 (랜덤 연습 등에서 직접 접근한 경우)
	useEffect(() => {
		if (!detailId && situationId) {
			import("../../../../../_constants/detailSituations").then(
				({ detailSituations }) => {
					const situations =
						detailSituations[situationId as keyof typeof detailSituations];
					if (situations && situations.length > 0) {
						const firstDetailId = situations[0].id;
						router.replace(
							`/practice/${situationId}/${firstDetailId}/dial/call`,
						);
					}
				},
			);
		}
	}, [detailId, situationId, router]);

	// 통화 시간 타이머
	useEffect(() => {
		const timer = setInterval(() => setSeconds((prev) => prev + 1), 1000);
		return () => clearInterval(timer);
	}, []);

	// 페이지 로드 시 자동으로 음성 재생 (DialPad에서 사용자 상호작용 받음)
	// biome-ignore lint/correctness/useExhaustiveDependencies: detailId 변경 시에만 재실행
	useEffect(() => {
		// 약간의 지연을 두어 페이지 로드 완료 후 실행
		const timer = setTimeout(() => {
			startAudioOnUserClick().catch((error) => {
				console.error("[Audio] 자동 재생 실패:", error);
			});
		}, 100);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailId]); // detailId 변경 시에만 재실행

	// 질문이 변경될 때마다 자동으로 음성 재생
	// biome-ignore lint/correctness/useExhaustiveDependencies: currentQuestionIndex 변경 시에만 재실행
	useEffect(() => {
		// 첫 질문은 위의 useEffect에서 처리하므로 스킵
		if (currentQuestionIndex === 0) {
			return;
		}

		// 질문 변경 시 음성 재생
		const timer = setTimeout(() => {
			playQuestionAudio().catch((error) => {
				console.error("[Audio] 질문 변경 시 재생 실패:", error);
			});
		}, 300); // 약간의 딜레이를 두어 UI 업데이트 후 재생

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentQuestionIndex]); // currentQuestionIndex 변경 시 재실행

	// 시간 포맷팅 (00:00)
	const formatTime = (totalSeconds: number) => {
		const mins = Math.floor(totalSeconds / 60);
		const secs = totalSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	};

	/**
	 * ❗ 질문 텍스트는 "순수 텍스트"로 유지한다.
	 * UI 줄바꿈은 렌더링 레이어에서 처리한다.
	 */
	const formatQuestion = (question: string) => {
		// 기존처럼 HTML(<br/>)을 섞지 않는다.
		// 화면에서 필요하면: question.replace("119입니다.", "119입니다.\n") 등으로 렌더링 측에서 처리한다.
		return question;
	};

	// Audio 관련 refs
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const hasStartedAudioRef = useRef(false);
	const audioEnabledRef = useRef(false);

	/**
	 * 안 보이는 iframe 생성 및 초기화 (음성 재생용)
	 */
	const ensureAudioIframe = (): HTMLIFrameElement => {
		if (iframeRef.current) {
			return iframeRef.current;
		}

		const iframe = document.createElement("iframe");
		iframe.style.position = "fixed";
		iframe.style.top = "-9999px";
		iframe.style.left = "-9999px";
		iframe.style.width = "1px";
		iframe.style.height = "1px";
		iframe.style.border = "none";
		iframe.style.opacity = "0";
		iframe.style.pointerEvents = "none";
		iframe.setAttribute("aria-hidden", "true");
		iframe.src = "/audio-player.html";
		document.body.appendChild(iframe);

		iframeRef.current = iframe;
		return iframe;
	};

	/**
	 * iframe 초기화 및 준비 대기
	 */
	const initAudioIframe = (): Promise<void> => {
		return new Promise((resolve, reject) => {
			const iframe = ensureAudioIframe();
			console.log("[Audio] iframe 초기화 시작:", {
				hasContentWindow: !!iframe.contentWindow,
				readyState: iframe.contentDocument?.readyState,
				src: iframe.src,
				isConnected: iframe.isConnected,
			});

			// 이미 로드되어 있어도 ready 메시지를 기다려야 함
			console.log("[Audio] iframe ready 메시지 대기 중...");

			let messageHandler: ((event: MessageEvent) => void) | null = null;
			let timeoutId: ReturnType<typeof setTimeout> | null = null;

			// iframe 준비 메시지 대기
			messageHandler = (event: MessageEvent) => {
				// React DevTools 메시지 무시
				if (
					event.data?.source === "react-devtools-content-script" ||
					event.data?.source === "react-devtools-bridge"
				) {
					return;
				}

				console.log("[Audio] iframe 메시지 수신:", event.data);
				if (event.data?.type === "ready") {
					console.log("[Audio] iframe 준비 완료");
					if (messageHandler) {
						window.removeEventListener("message", messageHandler);
					}
					if (timeoutId) {
						clearTimeout(timeoutId);
					}
					resolve();
				}
			};
			window.addEventListener("message", messageHandler);

			// 타임아웃 (5초)
			timeoutId = setTimeout(() => {
				if (messageHandler) {
					window.removeEventListener("message", messageHandler);
				}
				reject(new Error("iframe 초기화 타임아웃"));
			}, 5000);

			// iframe 로드 대기
			if (iframe.contentDocument?.readyState === "complete") {
				// 이미 로드됨 - ready 메시지만 대기 (위에서 이미 등록됨)
				console.log("[Audio] iframe 이미 로드됨, ready 메시지 대기 중...");
			} else {
				// 로드 중이면 onload 대기
				console.log("[Audio] iframe 로드 대기 중...");
				iframe.onload = () => {
					console.log(
						"[Audio] iframe onload 이벤트 발생, ready 메시지 대기 중...",
					);
					// ready 메시지는 messageHandler에서 처리됨
				};
			}
		});
	};

	/**
	 * iframe을 통한 음성 파일 재생 (턴 기반 제어용)
	 * - Promise<void> 반환: 재생 완료 시 resolve
	 * @param audioUrl 음성 파일 경로 (예: "/audio/fire-far/start.mp3")
	 */
	const playAudio = async (audioUrl: string): Promise<void> => {
		if (typeof window === "undefined") {
			return;
		}

		if (!audioUrl) {
			console.warn("[Audio] 음성 파일 경로가 없습니다.");
			return;
		}

		// iframe 초기화
		await initAudioIframe();

		const iframe = iframeRef.current;
		if (!iframe?.contentWindow) {
			throw new Error("iframe이 준비되지 않았습니다.");
		}

		console.log("[Audio] 재생 시작:", audioUrl);

		return new Promise<void>((resolve, reject) => {
			// 메시지 핸들러
			const messageHandler = (event: MessageEvent) => {
				// React DevTools 메시지 무시
				if (
					event.data?.source === "react-devtools-content-script" ||
					event.data?.source === "react-devtools-bridge"
				) {
					return;
				}

				console.log("[Audio] 메시지 수신:", event.data);
				const { type, audioUrl: receivedUrl } = event.data;

				// audioUrl이 없거나 다른 파일 메시지는 무시
				if (!receivedUrl || receivedUrl !== audioUrl) {
					if (receivedUrl) {
						console.log(
							"[Audio] 다른 파일 메시지 무시:",
							receivedUrl,
							"!=",
							audioUrl,
						);
					}
					return;
				}

				if (type === "ended") {
					console.log("[Audio] 재생 완료:", audioUrl);
					window.removeEventListener("message", messageHandler);
					resolve();
				} else if (type === "error") {
					console.error("[Audio] 재생 오류:", audioUrl, event.data);
					window.removeEventListener("message", messageHandler);
					reject(
						new Error(event.data.message || `음성 파일 재생 실패: ${audioUrl}`),
					);
				} else if (type === "playing") {
					console.log("[Audio] 재생 중:", audioUrl);
				}
			};

			window.addEventListener("message", messageHandler);

			// 타임아웃 (30초)
			const timeout = setTimeout(() => {
				window.removeEventListener("message", messageHandler);
				reject(new Error("음성 재생 타임아웃"));
			}, 30000);

			// 재생 메시지 전송
			try {
				if (!iframe.contentWindow) {
					throw new Error("iframe contentWindow이 없습니다.");
				}
				console.log("[Audio] iframe에 메시지 전송:", {
					type: "play",
					audioUrl,
				});
				console.log("[Audio] iframe 상태:", {
					hasContentWindow: !!iframe.contentWindow,
					readyState: iframe.contentDocument?.readyState,
					src: iframe.src,
				});
				iframe.contentWindow.postMessage({ type: "play", audioUrl }, "*");
				console.log("[Audio] 메시지 전송 완료");
			} catch (error) {
				console.error("[Audio] 메시지 전송 실패:", error);
				clearTimeout(timeout);
				window.removeEventListener("message", messageHandler);
				reject(error);
			}

			// resolve/reject 시 타임아웃 정리
			const originalResolve = resolve;
			const originalReject = reject;
			resolve = (...args) => {
				clearTimeout(timeout);
				originalResolve(...args);
			};
			reject = (...args) => {
				clearTimeout(timeout);
				originalReject(...args);
			};
		});
	};

	/**
	 * 질문에 해당하는 음성 파일 재생
	 * - currentQuestion의 audioUrl이 있으면 사용
	 * - 없으면 callScript.startAudioUrl 사용 (첫 질문인 경우)
	 */
	const playQuestionAudio = async (): Promise<void> => {
		const audioUrl =
			currentQuestion?.audioUrl ||
			(currentQuestionIndex === 0 ? callScript.startAudioUrl : undefined);

		if (!audioUrl) {
			console.warn("[Audio] 음성 파일이 없습니다. 텍스트만 표시됩니다.");
			return;
		}

		await playAudio(audioUrl);
	};

	/**
	 * ✅ 반드시 사용자 클릭에서 호출해야 한다.
	 * - 첫 음성을 user gesture 체인에서 시작해 브라우저 정책 준수
	 * - DialPad의 "시작하기" 버튼 클릭 후 호출됨
	 */
	const startAudioOnUserClick = async (): Promise<void> => {
		// 사용자 상호작용 확인
		if (typeof window !== "undefined") {
			const audioEnabled = sessionStorage.getItem("audioEnabled") === "true";
			if (!audioEnabled) {
				console.warn(
					"[Audio] 사용자 상호작용이 없습니다. DialPad에서 '시작하기' 버튼을 클릭해주세요.",
				);
				return;
			}
			audioEnabledRef.current = true;
		}

		if (hasStartedAudioRef.current) return;

		hasStartedAudioRef.current = true;

		try {
			await playQuestionAudio();
		} catch (e) {
			// 실패하면 다시 시도할 수 있게 플래그를 풀어준다.
			hasStartedAudioRef.current = false;
			console.error("[Audio] 실행 실패:", e);
		}
	};

	// cleanup: 언마운트 시 오디오 중지 및 iframe 정리
	useEffect(() => {
		return () => {
			// iframe에 중지 메시지 전송
			if (iframeRef.current?.contentWindow) {
				try {
					iframeRef.current.contentWindow.postMessage({ type: "stop" }, "*");
				} catch {
					// 무시
				}
			}

			// iframe 제거
			if (iframeRef.current?.parentNode) {
				try {
					iframeRef.current.parentNode.removeChild(iframeRef.current);
				} catch {
					// 무시
				}
				iframeRef.current = null;
			}
		};
	}, []);

	return {
		seconds,
		currentQuestionIndex,
		setCurrentQuestionIndex,
		showEndPopup,
		setShowEndPopup,
		reportId,
		detailId,
		situationId,
		callScript,
		currentQuestion,
		formatTime,
		formatQuestion,
		router,
		startTTSOnUserClick: startAudioOnUserClick, // 기존 API 호환성 유지
	};
}
