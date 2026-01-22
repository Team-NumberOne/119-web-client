"use client";

import { Icon } from "@team-numberone/daepiro-design-system";

interface CallButtonProps {
	onClick: () => void;
	disabled?: boolean;
}

export function CallButton({ onClick, disabled }: CallButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={`w-16 h-16 rounded-full flex items-center justify-center ${
				disabled
					? "opacity-40 bg-[#4DC585] cursor-not-allowed"
					: "bg-[#4DC585] shadow-[0_10px_40px_0_rgba(103,255,174,0.80)]"
			}`}
		>
			<Icon name="Phone" color="white" size={34} />
		</button>
	);
}
