import { Icons } from "@team-numberone/daepiro-design-system";
import { PhoneIcon } from "./PhoneIcon";

export function RandomPracticeCTA() {
	return (
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
					<span className="text-body-1-b text-gray-600">
						실전 처럼 연습하기
					</span>
				</div>
				<Icons.Start
					size={24}
					color="var(--color-gray-300)"
					className="shrink-0"
				/>
			</button>
		</div>
	);
}
