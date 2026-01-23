import type { Metadata, Viewport } from "next";
import "./globals.css";
import { QueryProvider } from "./providers/QueryProvider";

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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko" className="h-full">
			<body className="h-full bg-gray-50 no-scroll">
				<QueryProvider>{children}</QueryProvider>
			</body>
		</html>
	);
}
