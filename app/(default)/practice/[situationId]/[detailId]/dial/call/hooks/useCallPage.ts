"use client";

/**
 * 음성 파일 재생 방식으로 변경
 * - TTS 대신 미리 녹음된 음성 파일 재생
 * - HTML5 Audio API 사용
 * - Promise 기반 제어로 턴 기반 UX 지원
 */

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type ConversationScript,
	submitConversation,
} from "@/lib/api/bbiyoung";
import { getCallScript } from "../constants/callScript";

export function useCallPage() {
	const [seconds, setSeconds] = useState(0);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [showEndPopup, setShowEndPopup] = useState(false);
	const [reportId, setReportId] = useState<number | null>(null);

	// ✅ state + ref 동기화 (마지막 답변 누락 방지)
	const [conversation, setConversation] = useState<ConversationScript[]>([]);
	const conversationRef = useRef<ConversationScript[]>([]);

	const params = useParams();
	const router = useRouter();
	const detailId = (params.detailId as string) || "";
	const situationId = params.situationId as string;

	// 콜스크립트 가져오기
	const callScript = getCallScript(detailId);
	const currentQuestion = callScript.questions[currentQuestionIndex];

	// ✅ 답변 추가: ref 먼저 업데이트 → state 동기화
	const addAnswer = useCallback(
		(answer: string) => {
			const question =
				currentQuestion?.question ||
				(currentQuestionIndex === 0 ? callScript.start : "");
			if (!question) return;

			const next: ConversationScript[] = [
				...conversationRef.current,
				{ question, answer },
			];

			conversationRef.current = next;
			setConversation(next);
		},
		[currentQuestion, currentQuestionIndex, callScript.start],
	);
	let cachedPublicIp: string | null = null;

	const getPublicIp = useCallback(async (): Promise<string | null> => {
		if (typeof window === "undefined") return null;
		if (cachedPublicIp) return cachedPublicIp;

		const controllers: AbortController[] = [];
		const timeoutMs = 1500;

		const fetchWithTimeout = async (
			url: string,
			parser: (res: Response) => Promise<string>,
		) => {
			const controller = new AbortController();
			controllers.push(controller);

			const timeout = setTimeout(() => controller.abort(), timeoutMs);
			try {
				const res = await fetch(url, {
					method: "GET",
					cache: "no-store",
					signal: controller.signal,
				});
				if (!res.ok) return null;
				const ip = (await parser(res)).trim();
				// 아주 러프한 IPv4/IPv6 체크
				if (!ip || ip.length < 7) return null;
				return ip;
			} catch {
				return null;
			} finally {
				clearTimeout(timeout);
			}
		};

		try {
			// ✅ 1) ipify (json)
			const ip1 = await fetchWithTimeout(
				"https://api.ipify.org?format=json",
				async (res) => {
					const data = (await res.json()) as { ip?: string };
					return data.ip ?? "";
				},
			);
			if (ip1) {
				cachedPublicIp = ip1;
				return ip1;
			}

			// ✅ 2) ifconfig.me (text)
			const ip2 = await fetchWithTimeout(
				"https://ifconfig.me/ip",
				async (res) => res.text(),
			);
			if (ip2) {
				cachedPublicIp = ip2;
				return ip2;
			}

			// ✅ 3) ident.me (text)
			const ip3 = await fetchWithTimeout("https://ident.me", async (res) =>
				res.text(),
			);
			if (ip3) {
				cachedPublicIp = ip3;
				return ip3;
			}

			return null;
		} finally {
			// 남은 요청 abort (혹시라도)
			for (const c of controllers) {
				try {
					c.abort();
				} catch {
					// ignore
				}
			}
		}
	}, [cachedPublicIp]);

	// ✅ API 제출: 기본은 ref 기준, 필요하면 override 가능
	const submitReport = useCallback(
		async (scriptOverride?: ConversationScript[]) => {
			try {
				const scriptToSend = scriptOverride ?? conversationRef.current;
				const publicIp = await getPublicIp();
				const response = await submitConversation({
					id: situationId,
					script: scriptToSend,
					ip: publicIp ?? "unknown",
				});

				setReportId(response.resultId);
				return response.resultId;
			} catch (error) {
				console.error("Error submitting report:", error);
				return null;
			}
		},
		[situationId, getPublicIp],
	);

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
	const formatQuestion = (question: string) => question;

	// Audio 관련 refs
	const iframeRef = useRef<HTMLIFrameElement | null>(null);
	const hasStartedAudioRef = useRef(false);
	const audioEnabledRef = useRef(false);

	// ✅ 최신 재생만 유효하게 만들 토큰
	const playTokenRef = useRef(0);

	// ✅ iframe init은 한 번만 진행되도록 캐시
	const initPromiseRef = useRef<Promise<void> | null>(null);

	/**
	 * 안 보이는 iframe 생성 및 초기화 (음성 재생용)
	 */
	const ensureAudioIframe = (): HTMLIFrameElement => {
		if (iframeRef.current) return iframeRef.current;

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
		if (initPromiseRef.current) return initPromiseRef.current;

		initPromiseRef.current = new Promise((resolve, reject) => {
			const iframe = ensureAudioIframe();

			let timeoutId: ReturnType<typeof setTimeout> | null = null;

			const onMessage = (event: MessageEvent) => {
				// React DevTools 메시지 무시
				if (
					event.data?.source === "react-devtools-content-script" ||
					event.data?.source === "react-devtools-bridge"
				) {
					return;
				}

				const cw = iframe.contentWindow;
				if (!cw) return;
				if (event.source !== cw) return;

				if (event.data?.type === "ready") {
					window.removeEventListener("message", onMessage);
					if (timeoutId) clearTimeout(timeoutId);
					resolve();
				}
			};

			window.addEventListener("message", onMessage);

			timeoutId = setTimeout(() => {
				window.removeEventListener("message", onMessage);
				initPromiseRef.current = null;
				reject(new Error("iframe 초기화 타임아웃"));
			}, 5000);

			iframe.onload = () => {
				// ready 메시지는 postMessage로 받음
			};
		});

		return initPromiseRef.current;
	};

	/**
	 * iframe을 통한 음성 파일 재생 (턴 기반 제어용)
	 * - Promise<void> 반환: 재생 완료 시 resolve
	 * @param audioUrl 음성 파일 경로 (예: "/audio/fire-far/start.mp3")
	 */
	const playAudio = async (audioUrl: string): Promise<void> => {
		if (typeof window === "undefined") return;
		if (!audioUrl) {
			console.warn("[Audio] 음성 파일 경로가 없습니다.");
			return;
		}

		// ✅ 새 재생 요청 토큰 발급 (이전 재생은 무효 처리)
		const token = ++playTokenRef.current;

		await initAudioIframe();

		const iframe = iframeRef.current;
		if (!iframe) throw new Error("iframe이 준비되지 않았습니다.");

		const cw = iframe.contentWindow;
		if (!cw) throw new Error("iframe contentWindow이 없습니다.");

		return new Promise<void>((resolve, reject) => {
			let timeoutId: ReturnType<typeof setTimeout> | null = null;

			const cleanup = () => {
				window.removeEventListener("message", onMessage);
				if (timeoutId) clearTimeout(timeoutId);
			};

			const onMessage = (event: MessageEvent) => {
				// React DevTools 메시지 무시
				if (
					event.data?.source === "react-devtools-content-script" ||
					event.data?.source === "react-devtools-bridge"
				) {
					return;
				}

				// ✅ iframe에서 온 메시지만 처리
				if (event.source !== cw) return;

				// ✅ 최신 토큰만 유효
				if (token !== playTokenRef.current) return;

				const { type, audioUrl: receivedUrl } = event.data ?? {};
				if (!receivedUrl || receivedUrl !== audioUrl) return;

				if (type === "ended") {
					cleanup();
					resolve();
				} else if (type === "error") {
					cleanup();
					reject(
						new Error(
							event.data?.message || `음성 파일 재생 실패: ${audioUrl}`,
						),
					);
				}
			};

			window.addEventListener("message", onMessage);

			timeoutId = setTimeout(() => {
				cleanup();
				reject(new Error("음성 재생 타임아웃"));
			}, 30000);

			// ✅ contentWindow null 가능성 제거한 상태에서 전송
			try {
				cw.postMessage({ type: "play", audioUrl }, "*");
			} catch (e) {
				cleanup();
				reject(e);
			}
		});
	};

	/**
	 * 질문에 해당하는 음성 파일 재생
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
	 */
	const startAudioOnUserClick = async (): Promise<void> => {
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
			hasStartedAudioRef.current = false;
			console.error("[Audio] 실행 실패:", e);
		}
	};

	// 페이지 로드 시 자동으로 음성 재생 (DialPad에서 사용자 상호작용 받음)
	// biome-ignore lint/correctness/useExhaustiveDependencies: detailId 변경 시에만 재실행
	useEffect(() => {
		const timer = setTimeout(() => {
			startAudioOnUserClick().catch((error) => {
				console.error("[Audio] 자동 재생 실패:", error);
			});
		}, 100);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detailId]);

	// 질문이 변경될 때마다 자동으로 음성 재생
	// biome-ignore lint/correctness/useExhaustiveDependencies: currentQuestionIndex 변경 시에만 재실행
	useEffect(() => {
		if (currentQuestionIndex === 0) return;

		const timer = setTimeout(() => {
			playQuestionAudio().catch((error) => {
				console.error("[Audio] 질문 변경 시 재생 실패:", error);
			});
		}, 300);

		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentQuestionIndex]);

	// cleanup: 언마운트 시 오디오 중지 및 iframe 정리
	useEffect(() => {
		return () => {
			const iframe = iframeRef.current;
			const cw = iframe?.contentWindow;

			if (cw) {
				try {
					cw.postMessage({ type: "stop" }, "*");
				} catch {}
			}

			if (iframe?.parentNode) {
				try {
					iframe.parentNode.removeChild(iframe);
				} catch {}
			}

			iframeRef.current = null;
			initPromiseRef.current = null;
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
		addAnswer,
		submitReport,
		conversation, // 디버깅/확인용 필요하면 유지
	};
}
