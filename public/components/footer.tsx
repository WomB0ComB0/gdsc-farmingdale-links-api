"use client";
import type { FC } from "react";

const Footer: FC = (): JSX.Element => {
	const year = new Date().getFullYear();
	const foundingYear = 2023;

	return (
		<footer
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "var(--spacing-md)",
				marginTop: "auto",
				color: "var(--text-secondary)",
				fontSize: "0.9rem",
                borderTop: "var(--border-glass)",
                background: "var(--bg-card)",
			}}
		>
			<p>
				© {foundingYear}-{year} GDSC Farmingdale
			</p>
			<p>
				Made with <span style={{ color: "var(--text-primary)" }}>♥</span> by{" "}
				<a
					target="_blank"
					href="https://mikeodnis.dev/"
					rel="noreferrer"
					style={{
						color: "var(--text-primary)",
						textDecoration: "underline",
						textDecorationColor: "var(--accent-secondary)",
                        textUnderlineOffset: "4px",
					}}
				>
					Mike Odnis
				</a>
			</p>
		</footer>
	);
};

export default Footer;
