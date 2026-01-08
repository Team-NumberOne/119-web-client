import { Button, Icons } from "@team-numberone/daepiro-design-system";
import { EmergencySituationCarousel } from "./components/EmergencySituationCarousel";
import { PhoneIcon } from "./components/PhoneIcon";

interface CarouselItem {
	id: string;
	tag: string;
	title: string;
	character?: React.ReactNode;
}

const carouselItems: CarouselItem[] = [
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

export default function HomePage() {
	return (
		<div className="h-full overflow-hidden flex flex-col">
			{/* 그라디언트  섹션 */}
			<div className="bg-green-gradient flex-76 pb-[20px] rounded-b-3xl shadow-layered overflow-hidden">
				<div className="w-full text-center mt-[56px]">
					<div className="text-gray-400 text-body-1 ">
						어떤 상황을 연습해볼까요?
					</div>
					<div className="font-bold text-[26px] line-[32px] text-gray-700">
						응급 상황 연습
					</div>
				</div>

				{/* 캐러셀 세션 */}
				<EmergencySituationCarousel items={carouselItems} />

				<div className="w-full px-[20px]">
					<Button variant="primary" className="w-full">
						시작하기
					</Button>
				</div>
			</div>

			{/* CTA */}
			<div className="pt-6 px-5 flex-11 flex items-center">
				<button
					type="button"
					className="bg-white w-full rounded-2xl flex gap-3 p-4 items-center"
				>
					<div className="bg-primary-400 rounded-full w-8 h-8 flex justify-center items-center shrink-0">
						<PhoneIcon size={20} />
					</div>
					<div className="flex-1 text-left min-w-0">
						<span className="text-caption text-gray-400">
							어떤 상황이 나올지 몰라요!
						</span>
						<br />
						<span className="text-body-1 text-gray-600 font-bold">
							실전처럼 연습하기
						</span>
					</div>
					<Icons.Start
						size={24}
						color="var(--color-gray-300)"
						className="shrink-0"
					/>
				</button>
			</div>
		</div>
	);
}
