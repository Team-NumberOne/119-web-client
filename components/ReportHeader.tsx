import Link from "next/link";
import { IconWrapper } from "./icons/IconWrapper";

export function ReportHeader() {
	return (
		<header className="w-full px-6 py-[18px] h-[56px]">
			<nav>
				<Link href="/">
					<IconWrapper name="Logo" color="var(--color-secondary-500)" />
				</Link>
			</nav>
		</header>
	);
}
