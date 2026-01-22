export interface DetailSituation {
	id: string;
	location: string; // "멀리 난", "제 앞에" 등
	description: string; // "불을 봤어요", "불이 났어요" 등
}

export type SituationId = "fire" | "emergency" | "injury" | "drowning";

export const detailSituations: Record<SituationId, DetailSituation[]> = {
	fire: [
		{ id: "fire-far", location: "멀리에", description: "난 불" },
		{ id: "fire-near", location: "바로 앞에", description: "난 불" },
	],
	emergency: [
		{
			id: "emergency-friend",
			location: "친구가",
			description: "쓰러졌어요",
		},
		{
			id: "emergency-family",
			location: "가족(보호자)가",
			description: "쓰러졌어요",
		},
	],
	injury: [
		{ id: "injury-me", location: "내가", description: "다쳤어요" },
		{ id: "injury-other", location: "친구/보호자가", description: "다쳤어요" },
	],
	drowning: [
		{
			id: "drowning-friend",
			location: "친구가",
			description: "물에 빠졌어요",
		},
		{ id: "drowning-family", location: "가족이", description: "물에 빠졌어요" },
	],
};
