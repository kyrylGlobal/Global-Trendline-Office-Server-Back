"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BaselinkerStatisticController_1 = __importDefault(require("../controllers/BaselinkerStatisticController"));
const baselinkerRouter = (0, express_1.Router)();
baselinkerRouter.get('/statuses/get', (req, res, next) => {
    BaselinkerStatisticController_1.default.getStauses(req, res, next);
});
baselinkerRouter.post('/statistic/get', (req, res, next) => {
    BaselinkerStatisticController_1.default.getStatistic(req, res, next);
});
baselinkerRouter.post('/statistic/sheet/sent', (req, res, next) => {
    BaselinkerStatisticController_1.default.sendStatistic(req, res, next);
});
exports.default = baselinkerRouter;
