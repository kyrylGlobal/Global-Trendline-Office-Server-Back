"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ScannerController_1 = __importDefault(require("../controllers/ScannerController"));
const scannerRouter = (0, express_1.Router)();
scannerRouter.post("", (req, res, next) => {
    ScannerController_1.default.acceptBarCode(req, res, next);
});
exports.default = scannerRouter;
