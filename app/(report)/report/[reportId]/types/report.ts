export interface BbiyoungResponse {
	code: number;
	message: string;
	data: {
		resultId: number;
		title: string;
		totalScore: number;
		itemScores: Array<{
			title: string;
			score: number;
		}>;
		comment: string;
	};
}

export type ReportData = BbiyoungResponse["data"];
