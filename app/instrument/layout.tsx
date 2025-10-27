import type { ReactNode } from "react";

export const metadata = {
	// Default title, overridden later.
	title: "Instrument Details | IBEX Web Dashboard",
};

export default function ClientLayout({ children }: { children: ReactNode }) {
	return children;
}
