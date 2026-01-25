export interface CallScriptItem {
	question: string;
	hintTitle: string;
	hintDescription: string;
	audioUrl?: string; // 음성 파일 경로 (예: "/audio/fire-far/question-1.mp3")
}

export interface CallScript {
	start: string;
	startAudioUrl?: string; // 시작 음성 파일 경로
	questions: CallScriptItem[];
}

export const CALL_SCRIPTS: Record<string, CallScript> = {
	// 상황 1-1: fire-far (멀리 난 불)
	"fire-far": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/fire-far/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨 일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/fire-far/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "불이 났는지 말해줘",
				audioUrl: "/audio/fire-far/question-2.mp3",
			},
			{
				question: "사람이 안에 있나요?",
				hintTitle: "도움이 필요한 사람",
				hintDescription: "있는지 말해줘",
				audioUrl: "/audio/fire-far/question-3.mp3",
			},
			{
				question: "불이 많이 번졌나요?",
				hintTitle: "불의 상황을",
				hintDescription: "말해줘",
				audioUrl: "/audio/fire-far/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/fire-far/question-5.mp3",
			},
		],
	},
	// 상황 1-2: fire-near (바로 앞에 난 불)
	"fire-near": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/fire-near/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨 일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/fire-near/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "불이 났는지 말해줘",
				audioUrl: "/audio/fire-near/question-2.mp3",
			},
			{
				question: "불이 많이 번졌나요?",
				hintTitle: "불의 상황을",
				hintDescription: "말해줘",
				audioUrl: "/audio/fire-near/question-3.mp3",
			},
			{
				question: "신고자 분은 안전한 곳에 계신가요?",
				hintTitle: "네 상황을",
				hintDescription: "말해줘",
				audioUrl: "/audio/fire-near/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/fire-near/question-5.mp3",
			},
		],
	},
	// 상황 2-1: emergency-friend (친구가 쓰러짐)
	"emergency-friend": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/emergency-friend/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/emergency-friend/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "쓰러진건지 말해줘",
				audioUrl: "/audio/emergency-friend/question-2.mp3",
			},
			{
				question: "친구가 의식이 있나요?",
				hintTitle: "눈을 뜨는지, 숨 쉬는지",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-friend/question-3.mp3",
			},
			{
				question: "친구는 남자인가요, 여자인가요? 나이는요?",
				hintTitle: "쓰러진 사람 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-friend/question-4.mp3",
			},
			{
				question: "다친 흔적이나 피가 보이나요?",
				hintTitle: "보이는 부상",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-friend/question-5.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-friend/question-6.mp3",
			},
		],
	},
	// 상황 2-2: emergency-family (보호자가 쓰러짐)
	"emergency-family": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/emergency-family/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/emergency-family/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "쓰러진건지 말해줘",
				audioUrl: "/audio/emergency-family/question-2.mp3",
			},
			{
				question: "보호자가 의식있나요?",
				hintTitle: "눈을 뜨는지, 숨 쉬는지",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-family/question-3.mp3",
			},
			{
				question: "다친 흔적이나 피가 보이나요?",
				hintTitle: "보이는 부상",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-family/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 연락처를 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/emergency-family/question-5.mp3",
			},
		],
	},
	// 상황 3-1: injury-me (내가 다침)
	"injury-me": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/injury-me/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/injury-me/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "다쳤는지 말해줘",
				audioUrl: "/audio/injury-me/question-2.mp3",
			},
			{
				question: "의식은 괜찮으세요? 어디가 가장 아픈가요?",
				hintTitle: "정신이 또렷한지,</br>가장 아픈 부위",
				hintDescription: "말해줘",
				audioUrl: "/audio/injury-me/question-3.mp3",
			},
			{
				question: "피가 많이 나거나, 몸이 꺾여 있나요?",
				hintTitle: "보이는 부상, <br/>움직일 때 느낌",
				hintDescription: "말해줘",
				audioUrl: "/audio/injury-me/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/injury-me/question-5.mp3",
			},
		],
	},
	// 상황 3-2: injury-other (친구/가족이 다침)
	"injury-other": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/injury-other/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/injury-other/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "다쳤는지 말해줘",
				audioUrl: "/audio/injury-other/question-2.mp3",
			},
			{
				question: "의식은 있으신가요? 말을 하거나 눈을 뜨나요?",
				hintTitle: "눈을 뜨는지,<br/>보이는 반응",
				hintDescription: "말해줘",
				audioUrl: "/audio/injury-other/question-3.mp3",
			},
			{
				question: "어디가 가장 아파 보이나요?",
				hintTitle: "보이는 부상,<br/>움직일 때 상태",
				hintDescription: "말해줘",
				audioUrl: "/audio/injury-other/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/injury-other/question-5.mp3",
			},
		],
	},
	// 상황 4-1: drowning-friend (친구가 물에 빠짐)
	"drowning-friend": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/drowning-friend/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/drowning-friend/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "빠진건지 말해줘",
				audioUrl: "/audio/drowning-friend/question-2.mp3",
			},
			{
				question: "친구가 지금 물 밖으로 나왔나요,<br/>아직 물 안에 있나요?",
				hintTitle: "물에 빠진 상황을",
				hintDescription: "상세히 말해줘",
				audioUrl: "/audio/drowning-friend/question-3.mp3",
			},
			{
				question:
					"절대 혼자 물에 들어가지 마시고,<br/>튜브, 줄 같은 게 있으면 던져줄 수 있나요?",
				hintTitle: "안전한 상태에서<br/>도움을 줘",
				hintDescription: "",
				audioUrl: "/audio/drowning-friend/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/drowning-friend/question-5.mp3",
			},
		],
	},
	// 상황 4-2: drowning-family (가족이 물에 빠짐)
	"drowning-family": {
		start: "119입니다. 어떤 일이 발생했나요?",
		startAudioUrl: "/audio/drowning-family/start.mp3",
		questions: [
			{
				question: "119입니다. 어떤 일이 발생했나요?",
				hintTitle: "무슨일이",
				hintDescription: "일어났는지 말해줘",
				audioUrl: "/audio/drowning-family/question-1.mp3",
			},
			{
				question: "그 위치가 어디인가요?",
				hintTitle: "어디서",
				hintDescription: "빠진건지 말해줘",
				audioUrl: "/audio/drowning-family/question-2.mp3",
			},
			{
				question:
					"보호자 분이 지금 물 밖으로 나왔나요,<br/>아직 물 안에 있나요?",
				hintTitle: "물에 빠진 상황을",
				hintDescription: "상세히 말해줘",
				audioUrl: "/audio/drowning-family/question-3.mp3",
			},
			{
				question:
					"절대 혼자 물에 들어가지 마시고,<br/>튜브, 줄 같은 게 있으면 던져줄 수 있나요?",
				hintTitle: "안전한 상태에서<br/>도움을 줘",
				hintDescription: "",
				audioUrl: "/audio/drowning-family/question-4.mp3",
			},
			{
				question: "신고자분의 이름과 전화번호 알려주세요.",
				hintTitle: "네 이름과 연락처 정보",
				hintDescription: "말해줘",
				audioUrl: "/audio/drowning-family/question-5.mp3",
			},
		],
	},
} as const;

// 기본 콜스크립트 (상황별로 없을 경우 사용)
export const DEFAULT_CALL_SCRIPT: CallScript = {
	start: "119입니다. 어떤 일이 발생했나요?",
	questions: [
		{
			question: "119입니다. 어떤 일이 발생했나요?",
			hintTitle: "무슨일이",
			hintDescription: "일어났는지 천천히 말해봐요",
		},
	],
};

// detailId로 콜스크립트 가져오기
export function getCallScript(detailId: string): CallScript {
	return CALL_SCRIPTS[detailId] || DEFAULT_CALL_SCRIPT;
}
