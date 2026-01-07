import { Icons } from "@team-numberone/daepiro-design-system";
import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
	title: "119-web-client",
	description: "대피로 디자인 시스템 + Tailwind CSS v4",
};

function MobileOnly({ children }: { children: React.ReactNode }) {
	return <div className="block sm:hidden">{children}</div>;
}

function DesktopOnly({ children }: { children: React.ReactNode }) {
	return <div className="hidden sm:block">{children}</div>;
}

function DesktopPlaceholder() {
	return (
		<div className="w-full h-screen flex justify-center items-center flex-col gap-3">
			<Icons.Warning color="var(--color-gray-300)" size={42} />
			<div className="text-center text-gray-600 text-h6">
				해당 서비스는 <br />
				모바일 환경에 맞춰 제작되었습니다.
			</div>
		</div>
	);
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<body className="min-h-screen bg-gray-50">
				<Header />

				<MobileOnly>
					{children}
					<Footer />
				</MobileOnly>

				<DesktopOnly>
					<DesktopPlaceholder />
				</DesktopOnly>
			</body>
		</html>
	);
}
