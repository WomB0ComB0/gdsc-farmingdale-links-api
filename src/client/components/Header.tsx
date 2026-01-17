"use client";
import type { FC } from "react";

const Header: FC<{ name?: string }> = ({
	name = "SUNY Farmingdale",
}): JSX.Element => {
	return (
		<header
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				width: "100%",
				minHeight: "40vh",
				padding: "var(--spacing-md)",
				textAlign: "center",
				position: "relative",
				zIndex: 1,
			}}
		>
			<article className="glass"
				style={{
					padding: "var(--spacing-lg)",
					borderRadius: "var(--radius-lg)",
					display: "flex",
					flexDirection: "column",
					gap: "var(--spacing-sm)",
					maxWidth: "800px",
					width: "100%",
				}}
			>
				<h1
					style={{
						fontSize: "clamp(2rem, 5vw, 3.5rem)",
						color: "var(--text-primary)",
						marginBottom: "var(--spacing-xs)",
                        letterSpacing: "-1px",
					}}
				>
					Google Student Developer Clubs
				</h1>
				<p
					style={{
						fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
						color: "var(--text-secondary)",
						fontWeight: 300,
					}}
				>
					{name}
				</p>
			</article>
		</header>
	);
};

export default Header;
