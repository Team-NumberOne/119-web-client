import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DesktopPlaceholder } from "./components/DesktopPlaceholder";
import "./globals.css";

export const metadata: Metadata = {
	title: "삐용",
	description: "대피로 디자인 시스템 + Tailwind CSS v4",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	viewportFit: "cover",
};

function MobileOnly({ children }: { children: React.ReactNode }) {
	return <div className="block sm:hidden">{children}</div>;
}

function DesktopOnly({ children }: { children: React.ReactNode }) {
	return <div className="hidden sm:block">{children}</div>;
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" className="h-full overflow-hidden">
			<body className="h-full overflow-hidden bg-gray-50">
				<MobileOnly>
					<div className="h-[100dvh] overflow-hidden flex flex-col flex-1">
						<Header />
						<main className="flex-87 overflow-hidden">{children}</main>
						<Footer />
					</div>
				</MobileOnly>

				<DesktopOnly>
					<DesktopPlaceholder />
				</DesktopOnly>
			</body>
		</html>
	);
}
