"use client";

import { Button, Modal } from "@team-numberone/daepiro-design-system";
import Image from "next/image";
import { useState } from "react";

interface PracticeOptionButtonProps {
	children: React.ReactNode;
	onClick?: () => void;
}

export function PracticeOptionButton({
	children,
	onClick,
}: PracticeOptionButtonProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleClick = () => {
		setIsModalOpen(true);
		onClick?.();
	};

	return (
		<>
			<Button
				full
				onClick={handleClick}
				className="rounded-[12px] bg-white border-2 border-solid border-gray-75"
			>
				{children}
			</Button>

			<Modal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				showCloseButton={false}
				actionButton={{
					label: "다시 선택하기",
					onClick: () => setIsModalOpen(false),
				}}
			>
				<div className="flex flex-col items-center gap-4">
					<div className="relative w-[200px] h-[200px] mb-8">
						<Image
							src="/dummy.png"
							alt="결과 이미지"
							width={200}
							height={200}
							className="object-contain"
						/>
					</div>
					<p className="text-h6 text-gray-700 text-center">
						연기만 나면 아직 불이 난 건<br /> 아닐 수 있어요.
					</p>
				</div>
			</Modal>
		</>
	);
}
