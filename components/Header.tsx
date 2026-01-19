import Link from "next/link";
import { IconWrapper } from "./icons/IconWrapper";

export function Header() {
	return (
		<header className="absolute top-0 left-0 w-full px-6 py-[18px] h-[56px]">
			<nav>
				<Link href="/">
					<IconWrapper name="Logo" color="var(--color-secondary-500)" />
				</Link>
			</nav>
		</header>
	);
}
