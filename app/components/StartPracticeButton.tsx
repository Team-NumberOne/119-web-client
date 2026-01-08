import { Button } from "@team-numberone/daepiro-design-system";

export function StartPracticeButton() {
	return (
		<div className="w-full px-[20px] shrink-0 pb-[clamp(12px,2svh,20px)] flex justify-center items-center">
			<Button variant="primary" className="w-full max-w-[280px]">
				시작하기
			</Button>
		</div>
	);
}
