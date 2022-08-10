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
const RaportService_1 = __importDefault(require("../services/RaportService"));
class RaportController {
    raportSales(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.files) {
                res.status(400).send("No files were uploaded!");
            }
            else {
                try {
                    if (Array.isArray(req.files.raport)) {
                        throw new Error("Can not accept several files. Please send me just one file.");
                    }
                    else {
                        const raportFile = req.files.raport;
                        const xmlResultData = yield RaportService_1.default.generateXmlResultFileData(raportFile);
                        res.attachment(raportFile.name); // res.setHeader('Content-type', "application/octet-stream"); res.setHeader('Content-disposition', 'attachment; filename=file.txt');
                        res.status(200).send(xmlResultData);
                    }
                }
                catch (error) {
                    next(new Error(error.message));
                }
            }
        });
    }
}
exports.default = new RaportController();
