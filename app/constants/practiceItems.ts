export interface CarouselItem {
	id: string;
	tag: string;
	title: string;
	character?: React.ReactNode;
}

export const practiceItems: CarouselItem[] = [
	{
		id: "drowning",
		tag: "익수 상황",
		title: "물에 빠졌어요!",
	},
	{
		id: "fire",
		tag: "화재 상황",
		title: "불이 났어요!",
	},
	{
		id: "emergency",
		tag: "응급 상황",
		title: "응급 환자가 있어요!",
	},
	{
		id: "traffic",
		tag: "교통사고",
		title: "교통사고가 발생했어요!",
	},
	{
		id: "other",
		tag: "기타",
		title: "다른 응급상황",
	},
];
