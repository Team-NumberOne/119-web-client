"use client";

import { Icon, Modal } from "@team-numberone/daepiro-design-system";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CallButton } from "./CallButton";
import { DialButton } from "./DialButton";

const DIAL_BUTTONS = [
	["1", "2", "3"],
	["4", "5", "6"],
	["7", "8", "9"],
	["*", "0", "#"],
];

export function DialPad() {
	const [phoneNumber, setPhoneNumber] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const router = useRouter();
	const params = useParams();
	const situationId = params.situationId as string;

	const handleNumberClick = (num: string) => {
		setPhoneNumber((prev) => prev + num);
	};

	const handleDelete = () => {
		setPhoneNumber((prev) => prev.slice(0, -1));
	};

	const handleCall = () => {
		setIsModalOpen(true);
		console.log("Calling:", phoneNumber);
	};

	const handleStartCall = () => {
		router.push(`/practice/${situationId}/dial/call`);
	};

	return (
		<div className="w-full max-w-[320px] flex flex-col gap-8 pt-[96.5px]">
			{/* 헤더 */}
			<div className="text-center min-h-[58px] flex flex-col justify-center">
				{phoneNumber ? (
					<div className="text-h3 text-gray-600">{phoneNumber}</div>
				) : (
					<h1 className="text-h6 text-gray-200">번호를 입력해주세요.</h1>
				)}
			</div>

			{/* 다이얼 패드 + 액션 버튼 */}
			<div className="grid grid-cols-3 gap-x-5 gap-y-4 justify-items-center">
				{/* 숫자 버튼 */}
				{DIAL_BUTTONS.flat().map((num) => (
					<DialButton
						key={num}
						value={num}
						onClick={() => handleNumberClick(num)}
					/>
				))}
				{/* 액션 버튼 행 */}
				<div /> {/* 빈 공간 */}
				<CallButton onClick={handleCall} />
				<button
					type="button"
					onClick={handleDelete}
					disabled={phoneNumber.length === 0}
					className="flex items-center justify-center"
					aria-label="삭제"
				>
					<Image
						src="/delete.svg"
						alt=""
						width={48}
						height={48}
						aria-hidden="true"
					/>
				</button>
			</div>

			{/* 통화 모달 */}
			<Modal
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				showCloseButton={false}
				actionButton={{
					label: "시작하기",
					leftIcon: <Icon name="Phone" width={24} height={24} />,
					onClick: handleStartCall,
				}}
			>
				<div className="flex flex-col items-center gap-7">
					<div className="relative w-[140px] h-[140px]">
						<Image
							src="/dummy.png"
							alt="통화 중"
							width={140}
							height={140}
							className="object-contain"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex gap-2">
							<Icon
								name="Certification"
								width={20}
								height={20}
								color="var(--color-primary-300)"
							/>
							<div className="font-gray-600 text-body-2 my-px">
								이건 실제 전화가 아니라, <span className="font-bold">연습</span>
								이에요.
							</div>
						</div>
						<div className="flex gap-2">
							<Icon
								name="Certification"
								width={20}
								height={20}
								color="var(--color-primary-300)"
							/>
							<div className="font-gray-600 text-body-2 my-px">
								꼭 <span className="font-bold">마이크 버튼</span>을 누르고
								말해주세요.
							</div>
						</div>
						<div className="flex gap-2">
							<Icon
								name="Certification"
								width={20}
								height={20}
								color="var(--color-primary-300)"
							/>
							<div className="font-gray-600 text-body-2 my-px">
								조용한 곳에서 <span className="font-bold">큰 목소리</span>로
								말해주세요.
							</div>
						</div>
					</div>
				</div>
			</Modal>
		</div>
	);
}
