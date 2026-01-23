interface ApiResponse<T> {
	code: number;
	message: string;
	data: T;
}

interface RequestOptions extends RequestInit {
	skipErrorHandling?: boolean;
}

/**
 * 공통 API 클라이언트
 */
class ApiClient {
	private getBaseUrl(): string {
		// 런타임에 base URL 결정
		// 서버 사이드에서는 절대 URL 필요
		if (typeof window === "undefined") {
			return (
				process.env.NEXT_PUBLIC_API_BASE_URL || "http://api.daepiro.site/api/v1"
			);
		}

		// 클라이언트 사이드에서는 rewrites를 통해 상대 경로 사용
		return "/api";
	}

	async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
		const { skipErrorHandling, ...fetchOptions } = options;

		const baseUrl = this.getBaseUrl();
		const url = `${baseUrl}${endpoint}`;
		const defaultHeaders: HeadersInit = {
			"Content-Type": "application/json",
			accept: "*/*",
		};

		const response = await fetch(url, {
			...fetchOptions,
			headers: {
				...defaultHeaders,
				...fetchOptions.headers,
			},
		});

		if (!response.ok) {
			throw new Error(`API 호출 실패: ${response.status}`);
		}

		const data: ApiResponse<T> = await response.json();

		if (!skipErrorHandling && data.code !== 1000 && data.code !== 0) {
			throw new Error(data.message);
		}

		return data.data;
	}

	async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "GET",
		});
	}

	async post<T>(
		endpoint: string,
		body?: unknown,
		options?: RequestOptions,
	): Promise<T> {
		return this.request<T>(endpoint, {
			...options,
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		});
	}
}

export const apiClient = new ApiClient();
