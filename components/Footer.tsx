import { Icons } from "@team-numberone/daepiro-design-system";

export function Footer() {
	return (
		<footer className="flex-8 flex justify-center items-center text-caption text-gray-200 gap-[6px] min-h-[60px]">
			<Icons.Warning size={"sm"} />
			<div>이 서비스는 '실제 119 연결'이 되지 않습니다.</div>
		</footer>
	);
}
