"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BaselinkerRaportController_1 = __importDefault(require("../controllers/BaselinkerRaportController"));
const baselinker_1 = require("../helpers/baselinker");
const BaselinkerApiController_1 = __importDefault(require("../services/BaselinkerApiController"));
const baselinkerRouter = (0, express_1.Router)();
baselinkerRouter.post('/raport/orders/count', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield BaselinkerRaportController_1.default.countOrders(req, res, next);
}));
baselinkerRouter.post('/statuses/change/ready/sent', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let baselinkerApiController = new BaselinkerApiController_1.default();
        let statuses = (yield baselinkerApiController.getStatuses()).statuses;
        let readyStatuses = (0, baselinker_1.filterStatusesByName)(statuses, /^Ready \w\w$/);
        let sendStatuses = (0, baselinker_1.filterStatusesByName)(statuses, /^Sent \w\w$/);
        const combinedStatuses = (0, baselinker_1.combineStatuseByCountry)(readyStatuses, sendStatuses);
        for (let countryCode of Object.keys(combinedStatuses)) {
            const countryStatuses = combinedStatuses[countryCode];
            console.log("Before orders");
            // console.log(`countryCode - ${countryCode}\ncountryStatuses - ${JSON.stringify(countryStatuses)}`)
            const readyOrders = yield baselinkerApiController.getOrders({ statusId: countryStatuses.ready.id });
            // console.log(readyOrders);
            console.log("After orders");
            readyOrders.forEach((order) => {
                // console.log(order);
                baselinkerApiController.setOrderStatus(order.order_id, countryStatuses.sent.id);
            });
            console.log("First cycle");
        }
        res.status(200).send("Done");
    }
    catch (error) {
        next(new Error(error.message));
    }
}));
exports.default = baselinkerRouter;
