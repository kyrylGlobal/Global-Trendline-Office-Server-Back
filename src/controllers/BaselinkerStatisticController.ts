import { NextFunction, Request, response, Response } from "express";
import { generateHeatersStatistic, sendStatisticToSheet } from "../helpers/baselinker";
import BaselinkerApiController, { GetOrdersParams } from "../services/BaselinkerApi";

class BaselinkerStatisticController {
    async getStauses(req: Request, res: Response, next: NextFunction) {
        let baselinkerApiController = new BaselinkerApiController();
        const statuses = await baselinkerApiController.getListOfStatuses();
        res.status(200).send(statuses);
    }

    async getStatistic(req: Request, res: Response, next: NextFunction) {
        const params: GetOrdersParams = req.body;
        let statistic = await generateHeatersStatistic(params)
        res.status(200).json(statistic);
    }

    async sendStatistic(req: Request, res: Response, next: NextFunction) {
        const statistic: any = req.body.statistic;
        const date = req.body.period;
        sendStatisticToSheet(statistic, date);
        res.status(200).send("Ok");
    }
}

export default new BaselinkerStatisticController();