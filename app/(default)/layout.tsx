import { DesktopPlaceholder } from "@/components/DesktopPlaceholder";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

function MobileOnly({ children }: { children: React.ReactNode }) {
	return <div className="block sm:hidden">{children}</div>;
}

function DesktopOnly({ children }: { children: React.ReactNode }) {
	return <div className="hidden sm:block">{children}</div>;
}

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<MobileOnly>
				<div className="h-[100dvh] overflow-hidden flex flex-col flex-1 no-scroll">
					<Header />
					<main className="flex-87 overflow-hidden">{children}</main>
					<Footer />
				</div>
			</MobileOnly>

			<DesktopOnly>
				<DesktopPlaceholder />
			</DesktopOnly>
		</>
	);
}
