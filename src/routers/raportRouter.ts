import { Router, Request, Response, NextFunction } from "express";
import RaportController from "../controllers/RaportController";

const raportRouter = Router();

raportRouter.post("/sales", (req: Request, res: Response, next: NextFunction) => {
    RaportController.raportSales(req, res, next);
})

export default raportRouter;