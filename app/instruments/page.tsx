import InstrumentsDisplay from "@/app/components/InstrumentsDisplay";

export default function Instruments() {
	return (
		<div
			className={`flex min-h-screen bg-gray-100 dark:bg-zinc-800  flex-col items-center justify-between`}
		>
			<InstrumentsDisplay sortByGroups={true} />
		</div>
	);
}
