import type { Request, Response } from "express";
import { Router } from "express";

const router: Router = Router();

router.get("/", (_req: Request, res: Response) => {
	res.status(200).json({ message: "Server is running" });
});

export default router;
