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
Object.defineProperty(exports, "__esModule", { value: true });
const barcodeScanner_1 = require("../helpers/barcodeScanner");
class ScannerController {
    acceptBarCode(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.barcode) {
                console.log(req.body.barcode);
                let fileWritingResponse = yield (0, barcodeScanner_1.addBarCodeToFile)(req.body.barcode);
                res.status(200).send(fileWritingResponse);
            }
            else {
                console.log("Request body is empty");
                res.status(500).send("Problem");
            }
        });
    }
}
exports.default = new ScannerController();
