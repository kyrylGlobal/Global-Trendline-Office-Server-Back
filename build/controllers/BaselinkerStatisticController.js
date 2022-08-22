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
const baselinker_1 = require("../helpers/baselinker");
const BaselinkerApiController_1 = __importDefault(require("../services/BaselinkerApiController"));
class BaselinkerStatisticController {
    getStauses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            let baselinkerApiController = new BaselinkerApiController_1.default();
            const statuses = yield baselinkerApiController.getListOfStatuses();
            res.status(200).send(statuses);
        });
    }
    getStatistic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const params = req.body;
            let statistic = yield (0, baselinker_1.generateHeatersStatistic)(params);
            res.status(200).json(statistic);
        });
    }
    sendStatistic(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const statistic = req.body.statistic;
            const date = req.body.period;
            (0, baselinker_1.sendStatisticToSheet)(statistic, date);
        });
    }
}
exports.default = new BaselinkerStatisticController();
