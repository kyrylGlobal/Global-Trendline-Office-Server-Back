import { Router } from "express";
import BaselinkerRaportController from "../controllers/BaselinkerRaportController";

const baselinkerRouter = Router();


baselinkerRouter.post('raport/orders/count', async (req, res, next) => {
    await BaselinkerRaportController.countOrders(req, res, next);
})


export default baselinkerRouter;