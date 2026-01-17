"use client";
import { useState } from "react";
import { Footer, Header, Nav } from "./components/index";

const App = (): JSX.Element => {
	const [openAccordion, setOpenAccordion] = useState<string | null>(null);

	const toggleAccordion = (id: string) => {
		setOpenAccordion(openAccordion === id ? null : id);
	};

	return (
		<div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
			<Nav />
			<Header />
			<main className="container animate-fade-in" style={{ flex: 1, paddingBottom: "var(--spacing-lg)" }}>
				<section style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", alignItems: "center" }}>
					<article className="glass" style={{ padding: "var(--spacing-md)", borderRadius: "var(--radius-md)", maxWidth: "800px", width: "100%" }}>
						<h2 style={{ fontSize: "2rem", marginBottom: "var(--spacing-sm)", color: "var(--text-primary)" }}>GDSC Links API</h2>
						<p style={{ lineHeight: "1.6", color: "var(--text-secondary)" }}>
							The purpose of this{" "}
							<a
								href="https://en.wikipedia.org/wiki/API"
								rel="noopener noreferrer"
								target="_blank"
								style={{ color: "var(--text-primary)", textDecoration: "underline", textDecorationColor: "var(--accent-secondary)" }}
							>
								API
							</a>
							{" "}is to provide a way for any GDSC chapter to access their event data. This API returns 2 JSON objects:
						</p>
						<ul style={{ marginTop: "var(--spacing-sm)", display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
							<li style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
								<span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>'past-events'</span>
								<a
									href="/api/v1/past-events"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "var(--text-secondary)", opacity: 0.8, fontSize: "0.9rem" }}
								>
									/api/v1/past-events
								</a>
							</li>
							<li style={{ display: "flex", alignItems: "center", gap: "var(--spacing-xs)" }}>
								<span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>'upcoming-events'</span>
								<a
									href="/api/v1/upcoming-events"
									target="_blank"
									rel="noopener noreferrer"
									style={{ color: "var(--text-secondary)", opacity: 0.8, fontSize: "0.9rem" }}
								>
									/api/v1/upcoming-events
								</a>
							</li>
						</ul>
					</article>

					<section style={{ display: "flex", flexWrap: "wrap", gap: "var(--spacing-md)", justifyContent: "center", width: "100%" }}>
						{/* Accordion Item 1 */}
						<div className="glass" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", width: "100%", maxWidth: "400px" }}>
							<button
								type="button"
								onClick={() => toggleAccordion("past")}
								style={{
									width: "100%",
									padding: "var(--spacing-sm)",
									background: "rgba(255,255,255,0.03)",
									border: "none",
									color: "var(--text-primary)",
									textAlign: "left",
									cursor: "pointer",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: "1.1rem",
									fontWeight: 600,
								}}
							>
								Past Events
								<span style={{ transform: openAccordion === "past" ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▼</span>
							</button>
							<div className={`accordion-content ${openAccordion === "past" ? "open" : ""}`}>
								<div className="accordion-inner" style={{ padding: "var(--spacing-sm)", borderTop: "var(--border-glass)" }}>
									<ul style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
										<li><strong>title:</strong> string</li>
										<li><strong>thumbnailLink:</strong> string</li>
										<li><strong>detailsLink:</strong> string</li>
									</ul>
								</div>
							</div>
						</div>

						{/* Accordion Item 2 */}
						<div className="glass" style={{ borderRadius: "var(--radius-md)", overflow: "hidden", width: "100%", maxWidth: "400px" }}>
							<button
								type="button"
								onClick={() => toggleAccordion("upcoming")}
								style={{
									width: "100%",
									padding: "var(--spacing-sm)",
									background: "rgba(255,255,255,0.03)",
									border: "none",
									color: "var(--text-primary)",
									textAlign: "left",
									cursor: "pointer",
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: "1.1rem",
									fontWeight: 600,
								}}
							>
								Upcoming Events
								<span style={{ transform: openAccordion === "upcoming" ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}>▼</span>
							</button>
							<div className={`accordion-content ${openAccordion === "upcoming" ? "open" : ""}`}>
								<div className="accordion-inner" style={{ padding: "var(--spacing-sm)", borderTop: "var(--border-glass)" }}>
									<ul style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
										<li><strong>title:</strong> string</li>
										<li><strong>thumbnailLink:</strong> string</li>
										<li><strong>detailsLink:</strong> string</li>
									</ul>
								</div>
							</div>
						</div>
					</section>
				</section>
			</main>
			<Footer />
		</div>
	);
};

export default App;
