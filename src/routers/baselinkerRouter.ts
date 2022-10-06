import { Router } from "express";
import BaselinkerSortController from "../controllers/BaselinkerSortController";
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

baselinkerRouter.post('/sorting', (req, res, next) => {
    BaselinkerSortController.sortDuplicateOrders(req, res, next)
})

baselinkerRouter.get('/update/orders', (req, res, next) => {
    BaselinkerSortController.updateOrdersData(req, res, next);
})


baselinkerRouter.post('/sorting/updateFile', (req, res, next) => {
    BaselinkerSortController.updateFileWithPeriodOrders(req, res, next);
})


export default baselinkerRouter;