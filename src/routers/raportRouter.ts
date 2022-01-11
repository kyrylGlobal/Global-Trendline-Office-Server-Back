import { Router, Request, Response } from "express";
import RaportController from "../controllers/RaportController";

const raportRouter = Router();

raportRouter.post("/sales", (req: Request, res: Response) => {
    RaportController.raportSales(req, res);
})

export default raportRouter;