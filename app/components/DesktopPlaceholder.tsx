import { IconWrapper } from "../../components/icons/IconWrapper";

export function DesktopPlaceholder() {
	return (
		<div className="w-full h-screen flex justify-center items-center flex-col gap-3">
			<IconWrapper name="Warning" color="var(--color-gray-300)" size={42} />
			<div className="text-center text-gray-600 text-h6">
				해당 서비스는 <br />
				모바일 환경에 맞춰 제작되었습니다.
			</div>
		</div>
	);
}
