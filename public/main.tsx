"use client";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./app";
import reportWebVitals from "./report-web-vitals";
import "./css/style.css";

const container = document.getElementById("app")!;
const root = createRoot(container);
root.render(
	<>
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route
					path="*"
					element={
						<>
							<main
								style={{
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
									height: "100dvh",
									width: "100dvw",
								}}
							>
								<h1>404 Not Found 😓</h1>
								<button
									style={{
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										height: "50px",
										width: "100px",
										borderRadius: "5px",
										border: "none",
										backgroundColor: "black",
										color: "white",
										cursor: "pointer",
										transition: "background-color 0.25s ease",
									}}
								>
									<a href="/">Go ⬅️ Home</a>
								</button>
							</main>
						</>
					}
				/>
			</Routes>
		</BrowserRouter>
	</>,
);

reportWebVitals();
