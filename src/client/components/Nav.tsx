"use client";
import { GdscLogo } from "./svgs/index";

const Nav = (): JSX.Element => {
	return (
		<nav
			className="glass"
			style={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
				padding: "0 var(--spacing-md)",
				height: "80px",
				position: "fixed",
				top: 0,
				left: 0,
				right: 0,
				zIndex: 100,
				borderBottom: "var(--border-glass)",
                borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                margin: "0 var(--spacing-sm)",
                marginTop: "var(--spacing-xs)",
			}}
		>
			<a
				href="https://gdsc.community.dev/farmingdale-state-college/"
				target="_blank"
				rel="noopener noreferrer"
				style={{
					display: "flex",
					alignItems: "center",
					height: "100%",
                    width: "60px",
                    transition: "transform 0.2s ease",
				}}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
			>
				<GdscLogo />
			</a>
			<ul style={{ display: "flex", gap: "var(--spacing-md)", listStyle: "none" }}>
				<li>
					<a
						href="https://github.com/GDSC-FSC/gdsc-farmingdale-links"
						target="_blank"
						rel="noopener noreferrer"
						style={{
							display: "flex",
							alignItems: "center",
							gap: "var(--spacing-xs)",
							color: "var(--text-primary)",
							fontWeight: 500,
                            fontSize: "1.1rem",
						}}
					>
						<i className="fa-brands fa-github" style={{ fontSize: "1.5rem" }}></i>
						<span>GitHub</span>
					</a>
				</li>
			</ul>
		</nav>
	);
};

export default Nav;
