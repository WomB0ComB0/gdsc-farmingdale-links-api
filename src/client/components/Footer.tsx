"use client";
import type { FC } from "react";
const Footer: FC = (): JSX.Element => {
	const year = new Date().getFullYear();
	/* yyyy-mm-dd format */
	const foundingYear = new Date("2023-08-28").getFullYear();
	return (
		<footer>
			<p>
				© {foundingYear}-{year} GDSC Farmingdale
			</p>
			<p>
				Made with 🖤 by{" "}
				<a target={`_blank`} href="https://mikeodnis.com/" rel="noreferrer">
					Mike Odnis
				</a>
			</p>
		</footer>
	);
};
export default Footer;

