export interface PracticeQuestion {
	id: string;
	question: string;
	situation: string;
	options: PracticeOption[];
	character?: React.ReactNode;
}

export interface PracticeOption {
	id: string;
	text: string;
	isCorrect?: boolean;
}

export type PracticeQuestionId = string;

export const practiceQuestions: Record<string, PracticeQuestion> = {
	"fire-far": {
		id: "fire-far",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "부엌에서 냄비 연기가 나요. 불꽃은 안 보여요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"fire-near": {
		id: "fire-near",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "제 앞에 불이 났어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"drowning-other": {
		id: "drowning-other",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "다른 사람이 물에 빠졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"drowning-me": {
		id: "drowning-me",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "제가 물에 빠졌어요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"emergency-conscious": {
		id: "emergency-conscious",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "의식이 있는 환자예요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"emergency-unconscious": {
		id: "emergency-unconscious",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "의식이 없는 환자예요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"traffic-minor": {
		id: "traffic-minor",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "경미한 교통사고예요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"traffic-severe": {
		id: "traffic-severe",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "심각한 교통사고예요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
	"other-specified": {
		id: "other-specified",
		question: "이 상황에서 어떻게 행동해야 할까요?",
		situation: "기타 응급상황이에요.",
		options: [
			{ id: "option-1", text: "119에 신고해요" },
			{ id: "option-2", text: "119에 신고해요" },
		],
	},
};
