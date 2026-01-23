import { DesktopPlaceholder } from "@/components/DesktopPlaceholder";
import { ReportHeader } from "@/components/ReportHeader";

function MobileOnly({ children }: { children: React.ReactNode }) {
	return <div className="block sm:hidden">{children}</div>;
}

function DesktopOnly({ children }: { children: React.ReactNode }) {
	return <div className="hidden sm:block">{children}</div>;
}

export default function ReportLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<MobileOnly>
				<div
					className="h-[100dvh] flex flex-col overflow-y-auto bg-white"
					style={{
						touchAction: "pan-y",
						WebkitOverflowScrolling: "touch",
						overscrollBehavior: "contain",
					}}
				>
					<ReportHeader />
					<main className="flex flex-col min-h-0">{children}</main>
				</div>
			</MobileOnly>

			<DesktopOnly>
				<DesktopPlaceholder />
			</DesktopOnly>
		</>
	);
}
