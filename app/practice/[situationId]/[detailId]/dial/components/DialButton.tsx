"use client";

import Image from "next/image";

interface DialButtonProps {
	value: string;
	onClick: () => void;
}

export function DialButton({ value, onClick }: DialButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="w-16 aspect-square rounded-full bg-gray-75 flex items-center justify-center text-h4 text-gray-600"
		>
			{value === "*" ? (
				<Image src="/star.svg" alt="*" width={34} height={34} />
			) : (
				value
			)}
		</button>
	);
}
