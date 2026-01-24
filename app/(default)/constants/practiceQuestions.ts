export interface PracticeQuestion {
	id: string;
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
		situation: "공원에서 놀다가</br>멀리서 연기가 보여",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "근처 어른에게 말하기", isCorrect: true },
		],
		incorrectFeedback:
			"불이 멀면 잘 안 보일 수 있어.<br />어른한테 바로 알리자!",
	},
	"fire-far-2": {
		id: "fire-far-2",
		situation: "놀이터 옆 쓰레기통에서</br>불길이 올라오고 있어",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "직접 물 뿌리기", isCorrect: false },
		],
		incorrectFeedback: "불 가까이 가면 위험해!<br />직접 끄지 말고 신고하자.",
	},
	// 화재 상황 - 바로 앞에 난 불
	"fire-near-1": {
		id: "fire-near-1",
		situation: "부엌의 냄비에서 연기가 나고</br>불꽃은 안 보여",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "엄마에게 알리기", isCorrect: true },
		],
		incorrectFeedback: "연기만 있으면<br />아직 불이 아닐 수도 있어!",
	},
	"fire-near-2": {
		id: "fire-near-2",
		situation: "부엌 가스레인지에<br/>불이 붙었고 연기가 나",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "물을 부어서 끄려고 해요", isCorrect: false },
		],
		incorrectFeedback: "기름 불에 물 부으면<br />불이 더 커져!",
	},
	// 익수 상황 - 친구가 물에 빠짐
	"drowning-friend-1": {
		id: "drowning-friend-1",
		situation: "얕은 물가에서</br>친구가 미끄러졌지만 일어났어",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "괜찮은지 물어보기", isCorrect: true },
		],
		incorrectFeedback:
			"금방 일어나면 괜찮을 수도 있어.<br/> 상태 먼저 살펴보자!",
	},
	"drowning-friend-2": {
		id: "drowning-friend-2",
		situation: "친구가 수영장 깊은 곳에서<br/>허우적거려",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "구하러 들어가기", isCorrect: false },
		],
		incorrectFeedback: "물에 들어가면 나도 위험해!<br/>바로 신고하자!",
	},
	// 익수 상황 - 가족이 물에 빠짐
	"drowning-family-1": {
		id: "drowning-family-1",
		situation: "엄마가 물가에서 발을 헛디뎌<br/>발만 물에 잠겼어",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "손 잡고 일으켜주기", isCorrect: true },
		],
		incorrectFeedback: "살짝 빠진 상황이면<br/>어른이 도와줄 수 있어.",
	},
	"drowning-family-2": {
		id: "drowning-family-2",
		situation: "아빠가 강물에 빠져<br/>허우적거리고 있어",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "구하러 들어가기", isCorrect: false },
		],
		incorrectFeedback: "물에 들어가면 나도 위험해!<br/>바로 신고하자!",
	},
	// 의식 소실/심정지 상황 - 친구가 쓰러짐
	"emergency-friend-1": {
		id: "emergency-friend-1",
		situation: "체육 시간에 친구가<br/>넘어지고 울고 있어",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "선생님에게 알리기", isCorrect: true },
		],
		incorrectFeedback: "친구가 움직이면 아직 괜찮아.<br/>선생님을 불러줘!",
	},
	"emergency-friend-2": {
		id: "emergency-friend-2",
		situation: "친구가 놀이터에서 쓰러졌는데<br/>눈을 뜨지 않아",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "친구 이름 크게 불러보기", isCorrect: false },
		],
		incorrectFeedback: "눈을 안 뜨면 아주 급한 상황이야.<br/>바로 신고하자!",
	},
	// 의식 소실/심정지 상황 - 가족(보호자)가 쓰러짐
	"emergency-family-1": {
		id: "emergency-family-1",
		situation: "아빠가 어지러워서 쉰다며<br/>잠시 눈을 감았어",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "집에서 쉬게 해요", isCorrect: true },
		],
		incorrectFeedback:
			"아빠가 대답하면 의식이 있어.<br/>지금은 신고 안 해도 돼!",
	},
	"emergency-family-2": {
		id: "emergency-family-2",
		situation: "할아버지가 쓰러졌는데<br/>아무 말도 안 하셔",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{
				id: "option-2",
				text: "물을 가져와서 얼굴에 뿌리기",
				isCorrect: false,
			},
		],
		incorrectFeedback: "물로 깨우면 위험해.<br/>바로 신고하자!",
	},
	// 부상 상황 - 내가 다침
	"injury-me-1": {
		id: "injury-me-1",
		situation: "자전거를 타다가 넘어져서</br>피가 조금 나",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "근처 어른에게 도움 요청하기", isCorrect: true },
		],
		incorrectFeedback: "살짝 다친 상황이면</br>어른이 도와줄 수 있어.",
	},
	"injury-me-2": {
		id: "injury-me-2",
		situation: "계단에서 굴렀는데</br>너무 아파서 움직이지 못해",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "옆 친구에게 도움 요청하기", isCorrect: false },
		],
		incorrectFeedback: "많이 아파하거나 못 움직이면</br>바로 신고하자!",
	},
	// 부상 상황 - 친구/보호자가 다침
	"injury-other-1": {
		id: "injury-other-1",
		situation: "친구가 넘어져서</br>무릎에 피가 조금 나",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: false },
			{ id: "option-2", text: "선생님에게 알리기", isCorrect: true },
		],
		incorrectFeedback: "살짝 다친 상황이면</br>어른이 도와줄 수 있어.",
	},
	"injury-other-2": {
		id: "injury-other-2",
		situation: "할머니가 넘어져서</br>다리가 많이 아프시대",
		options: [
			{ id: "option-1", text: "119에 신고해요", isCorrect: true },
			{ id: "option-2", text: "잠시 쉬게 하기", isCorrect: false },
		],
		incorrectFeedback: "많이 아파하거나 못 움직이면</br>바로 신고하자!",
	},
};
