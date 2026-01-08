export interface DetailSituation {
	id: string;
	location: string; // "멀리 난", "제 앞에" 등
	description: string; // "불을 봤어요", "불이 났어요" 등
}

export type SituationId =
	| "fire"
	| "drowning"
	| "emergency"
	| "traffic"
	| "other";

export const detailSituations: Record<SituationId, DetailSituation[]> = {
	fire: [
		{ id: "fire-far", location: "멀리 난", description: "불을 봤어요" },
		{ id: "fire-near", location: "제 앞에", description: "불이 났어요" },
	],
	drowning: [
		{
			id: "drowning-other",
			location: "다른 사람이",
			description: "물에 빠졌어요",
		},
		{ id: "drowning-me", location: "제가", description: "물에 빠졌어요" },
	],
	emergency: [
		{
			id: "emergency-conscious",
			location: "의식이",
			description: "있는 환자예요",
		},
		{
			id: "emergency-unconscious",
			location: "의식이",
			description: "없는 환자예요",
		},
	],
	traffic: [
		{ id: "traffic-minor", location: "경미한", description: "교통사고예요" },
		{ id: "traffic-severe", location: "심각한", description: "교통사고예요" },
	],
	other: [
		{ id: "other-specified", location: "기타", description: "응급상황이에요" },
	],
};
