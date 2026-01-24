"use client";

import { ErrorBoundary } from "react-error-boundary";

interface ReportErrorFallbackProps {
	error: Error;
	resetErrorBoundary: () => void;
}

function ReportErrorFallback({
	error,
	resetErrorBoundary,
}: ReportErrorFallbackProps) {
	return (
		<div className="h-full flex items-center justify-center px-5">
			<div className="text-center flex flex-col gap-4 max-w-[320px]">
				<div className="flex flex-col gap-2">
					<div className="text-body-1 text-gray-500">
						리포트를 불러오는 중 오류가 발생했습니다.
					</div>
					{error && (
						<div className="text-caption text-gray-400">{error.message}</div>
					)}
				</div>
				<button
					type="button"
					onClick={resetErrorBoundary}
					className="px-4 py-2 bg-primary-400 text-white rounded-lg text-body-1 font-bold hover:bg-primary-500 transition-colors"
				>
					다시 시도
				</button>
			</div>
		</div>
	);
}

interface ReportErrorBoundaryProps {
	children: React.ReactNode;
	fallback?: React.ComponentProps<typeof ErrorBoundary>["fallback"];
	onReset?: () => void;
}

export function ReportErrorBoundary({
	children,
	fallback,
	onReset,
}: ReportErrorBoundaryProps) {
	if (fallback) {
		return (
			<ErrorBoundary
				fallback={fallback}
				onError={(error, errorInfo) => {
					console.error(
						"ReportErrorBoundary caught an error:",
						error,
						errorInfo,
					);
				}}
			>
				{children}
			</ErrorBoundary>
		);
	}

	return (
		<ErrorBoundary
			fallbackRender={({ error, resetErrorBoundary }) => (
				<ReportErrorFallback
					error={error instanceof Error ? error : new Error(String(error))}
					resetErrorBoundary={() => {
						resetErrorBoundary();
						onReset?.();
					}}
				/>
			)}
			onError={(error, errorInfo) => {
				console.error("ReportErrorBoundary caught an error:", error, errorInfo);
			}}
		>
			{children}
		</ErrorBoundary>
	);
}
