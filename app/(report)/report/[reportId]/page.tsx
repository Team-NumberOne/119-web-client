import { Suspense } from "react";
import { ReportContent } from "./components/ReportContent";
import { ReportErrorBoundary } from "./components/ReportErrorBoundary";
import { ReportLoading } from "./components/ReportLoading";

interface ReportPageProps {
	params: Promise<{ reportId: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
	const { reportId } = await params;

	return (
		<ReportErrorBoundary>
			<Suspense fallback={<ReportLoading />}>
				<ReportContent reportId={reportId} />
			</Suspense>
		</ReportErrorBoundary>
	);
}
