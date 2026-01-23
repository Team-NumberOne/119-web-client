export interface PracticeQuestion {
	id: string;
	question: string;
	situation: string;
	options: PracticeOption[];
	incorrectFeedback?: string;
	character?: React.ReactNode;
}

export interface PracticeOption {
	id: string;
	text: string;
	isCorrect?: boolean;
}

export type PracticeQuestionId = string;

export const practiceQuestions: Record<string, PracticeQuestion> = {
	// 화재 상황 - 멀리에 난 불
	"fire-far-1": {
		id: "fire-far-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "부엌에서 냄비 연기가 나요. 불꽃은 안 보여요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "직접 불을 끄려고 해요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"fire-far-2": {
		id: "fire-far-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "멀리서 연기가 보여요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "가까이 가서 확인해요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 화재 상황 - 바로 앞에 난 불
	"fire-near-1": {
		id: "fire-near-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "제 앞에 불이 났어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "바로 도망가요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"fire-near-2": {
		id: "fire-near-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "가까운 곳에서 불이 났어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "물을 부어서 끄려고 해요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 익수 상황 - 친구가 물에 빠짐
	"drowning-friend-1": {
		id: "drowning-friend-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "친구가 물에 빠졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "직접 물에 뛰어들어 구해요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"drowning-friend-2": {
		id: "drowning-friend-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "친구가 물에 빠져서 도와달라고 해요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "주변에 도움을 요청해요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 익수 상황 - 가족이 물에 빠짐
	"drowning-family-1": {
		id: "drowning-family-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "가족이 물에 빠졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "물에 뛰어들어 구하려고 해요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"drowning-family-2": {
		id: "drowning-family-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "가족이 물에 빠져서 위험해요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "가까이 가서 손을 내밀어요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 의식 소실/심정지 상황 - 친구가 쓰러짐
	"emergency-friend-1": {
		id: "emergency-friend-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "친구가 쓰러졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "병원에 데려가요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"emergency-friend-2": {
		id: "emergency-friend-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "친구가 갑자기 쓰러졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "물을 주거나 깨우려고 해요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 의식 소실/심정지 상황 - 가족(보호자)가 쓰러짐
	"emergency-family-1": {
		id: "emergency-family-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "가족(보호자)가 쓰러졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "집에서 쉬게 해요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"emergency-family-2": {
		id: "emergency-family-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "가족(보호자)가 갑자기 쓰러졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{
				id: "option-2",
				text: "주변 사람들에게 도움 요청해요",
				isCorrect: false,
			},
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 부상 상황 - 내가 다침
	"injury-me-1": {
		id: "injury-me-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "내가 다쳤어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "병원에 직접 가요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"injury-me-2": {
		id: "injury-me-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "제가 크게 다쳤어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "집에서 치료해요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	// 부상 상황 - 친구/보호자가 다침
	"injury-other-1": {
		id: "injury-other-1",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "친구/보호자가 다쳤어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "병원에 데려가요", isCorrect: true },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
	"injury-other-2": {
		id: "injury-other-2",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "친구/보호자가 크게 다쳤어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "상처를 직접 치료해요", isCorrect: false },
		],
		incorrectFeedback: "연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.",
	},
};
