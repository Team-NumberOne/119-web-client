"use client";

import { Button } from "@team-numberone/daepiro-design-system";
import { useRouter } from "next/navigation";

interface StartPracticeButtonProps {
	situationId: string;
}

export function StartPracticeButton({ situationId }: StartPracticeButtonProps) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/practice/${situationId}`);
	};

	return (
		<div className="w-full px-[20px] shrink-0 pb-[clamp(12px,2svh,20px)] flex justify-center items-center">
			<Button
				variant="primary"
				className="w-full max-w-[280px]"
				onClick={handleClick}
			>
				시작하기
			</Button>
		</div>
	);
}
