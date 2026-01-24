"use client";

import { Button, Modal } from "@team-numberone/daepiro-design-system";
import Image from "next/image";

interface CallEndPopupProps {
	isOpen: boolean;
	onViewResult: () => void;
}

export function CallEndPopup({ isOpen, onViewResult }: CallEndPopupProps) {
	return (
		<Modal open={isOpen} onOpenChange={() => {}} showCloseButton={false}>
			<div className="flex flex-col items-center gap-7">
				<div className="relative w-[140px] h-[140px]">
					<Image
						src="/practice/practice-end-popup.png"
						alt="신고 완료"
						width={140}
						height={140}
						className="object-contain"
					/>
				</div>
				<div className="text-center text-body-1 text-gray-700">
					소방차가 출동했어요
					<br />
					성공적으로 신고 완료!
				</div>
				<Button
					variant="primary"
					full
					onClick={onViewResult}
					className="font-bold"
				>
					신고 결과 보기
				</Button>
			</div>
		</Modal>
	);
}
