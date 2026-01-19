import { notFound } from "next/navigation";
import { practiceItems } from "@/app/constants/practiceItems";
import { DialPad } from "./components/DialPad";

interface DialPageProps {
	params: Promise<{ situationId: string }>;
}

export default async function DialPage({ params }: DialPageProps) {
	const { situationId } = await params;

	const situation = practiceItems.find((item) => item.id === situationId);

	if (!situation) {
		notFound();
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex-1 flex flex-col items-center">
				<DialPad />
			</div>
		</div>
	);
}
