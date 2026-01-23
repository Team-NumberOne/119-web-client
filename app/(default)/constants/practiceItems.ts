export interface CarouselItem {
	id: string;
	tag: string;
	title: string;
	character?: React.ReactNode;
}

export const practiceItems: CarouselItem[] = [
	{
		id: "fire",
		tag: "화재 상황",
		title: "불이 났어요!",
	},
	{
		id: "emergency",
		tag: "의식 소실/심정지 상황",
		title: "의식이 없어요!",
	},
	{
		id: "injury",
		tag: "부상 상황",
		title: "다쳤어요!",
	},
	{
		id: "drowning",
		tag: "익수 상황",
		title: "물에 빠졌어요!",
	},
];
