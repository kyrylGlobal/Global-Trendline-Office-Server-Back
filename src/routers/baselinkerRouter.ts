import { Router } from "express";
import BaselinkerStatisticController from "../controllers/BaselinkerStatisticController";

const baselinkerRouter = Router();

baselinkerRouter.get('/statuses/get', (req, res, next) => {
    BaselinkerStatisticController.getStauses(req, res, next);
})

baselinkerRouter.post('/statistic/get', (req, res, next) => {
    BaselinkerStatisticController.getStatistic(req, res, next);
})

baselinkerRouter.post('/statistic/sheet/sent', (req, res, next) => {
    BaselinkerStatisticController.sendStatistic(req, res, next);
})


export default baselinkerRouter;