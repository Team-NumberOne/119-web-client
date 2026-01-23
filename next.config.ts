import { createVanillaExtractPlugin } from "@vanilla-extract/next-plugin";
import type { NextConfig } from "next";

const withVanillaExtract = createVanillaExtractPlugin();

const nextConfig: NextConfig = {
	async rewrites() {
		const apiBaseUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://api.daepiro.site/api/v1";
		return [
			{
				source: "/api/bbiyoung/:path*",
				destination: `${apiBaseUrl}/bbiyoung/:path*`,
			},
		];
	},
};

export default withVanillaExtract(nextConfig);
