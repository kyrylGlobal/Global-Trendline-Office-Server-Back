"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RaportController_1 = __importDefault(require("../controllers/RaportController"));
const raportRouter = (0, express_1.Router)();
raportRouter.post("/sales", (req, res, next) => {
    RaportController_1.default.raportSales(req, res, next);
});
exports.default = raportRouter;
