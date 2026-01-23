"use client";

import { Component, type ReactNode } from "react";

interface ReportErrorBoundaryProps {
	children: ReactNode;
	fallback?: ReactNode;
}

interface ReportErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ReportErrorBoundary extends Component<
	ReportErrorBoundaryProps,
	ReportErrorBoundaryState
> {
	constructor(props: ReportErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ReportErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ReportErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				this.props.fallback || (
					<div className="h-full flex items-center justify-center">
						<div className="text-center flex flex-col gap-2">
							<div className="text-body-1 text-gray-500">
								리포트를 불러오는 중 오류가 발생했습니다.
							</div>
							{this.state.error && (
								<div className="text-caption text-gray-400">
									{this.state.error.message}
								</div>
							)}
						</div>
					</div>
				)
			);
		}

		return this.props.children;
	}
}
