import { Router } from "express";
import BaselinkerRaportController from "../controllers/BaselinkerRaportController";
import { combineStatuseByCountry, filterStatusesByName } from "../helpers/baselinker";
import BaselinkerApiController from "../services/BaselinkerApiController";

const baselinkerRouter = Router();


baselinkerRouter.post('/raport/orders/count', async (req, res, next) => {
    await BaselinkerRaportController.countOrders(req, res, next);
})

baselinkerRouter.post('/statuses/change/ready/sent', async (req, res, next) => {
    try {
        let baselinkerApiController = new BaselinkerApiController();
        let statuses = (await baselinkerApiController.getStatuses()).statuses;
        let readyStatuses = filterStatusesByName(statuses as Array<any>, /^Ready \w\w$/);
        let sendStatuses = filterStatusesByName(statuses as Array<any>, /^Sent \w\w$/);
        const combinedStatuses = combineStatuseByCountry(readyStatuses, sendStatuses);

        for(let countryCode of Object.keys(combinedStatuses)) {
            const countryStatuses = combinedStatuses[countryCode];
            console.log("Before orders")
            // console.log(`countryCode - ${countryCode}\ncountryStatuses - ${JSON.stringify(countryStatuses)}`)
            const readyOrders = await baselinkerApiController.getOrders(countryStatuses.ready.id);
            // console.log(readyOrders);
            console.log("After orders")
            readyOrders.forEach( (order: any) => {
                // console.log(order);
                baselinkerApiController.setOrderStatus(order.order_id, countryStatuses.sent.id);
            })

            console.log("First cycle")
        }

        res.status(200).send("Done");
    }
    catch(error: any) {
        next(new Error(error.message))
    }
})


export default baselinkerRouter;