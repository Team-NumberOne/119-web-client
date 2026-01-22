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
			className="w-16 h-16 rounded-full bg-primary-400 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<Icon name="Phone" color="white" size={34} />
		</button>
	);
}
