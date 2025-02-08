import type { Request, Response } from "express";
import { Router } from "express";
import { keepAlive } from "../controllers/keepAlive";
const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
	console.log("Requested health check");
	setInterval(keepAlive, 1000 * 60 * 15);
	res.status(200).json({ message: "Server is running" });
});

export default router;
