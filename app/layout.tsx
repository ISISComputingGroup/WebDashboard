import "./globals.css";
import type { ReactNode } from "react";
import Footer from "./Footer";
import NavBar from "./NavBar";

export const metadata = {
	title: "Home | IBEX Web Dashboard",
	description: "Home | IBEX Web Dashboard",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="dark">
				<NavBar />
				{children}
				<Footer />
			</body>
		</html>
	);
}
