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
const fast_xml_parser_1 = require("../helpers/fast-xml-parser");
class RaportService {
    generateXmlResultFileData(raportFile) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkFileExtention(raportFile.mimetype);
            const fileDataXml = this.getDataString(raportFile);
            const xmlResult = yield (0, fast_xml_parser_1.resolveSalesRaport)(fileDataXml);
            return xmlResult;
        });
    }
    getDataString(file) {
        if (Array.isArray(file)) {
            throw new Error("Can not work with array right now.");
        }
        else {
            const fileString = file.data.toString('utf-8');
            return fileString;
        }
    }
    getFileName(file) {
        return file.name;
    }
    checkFileExtention(extention) {
        const availableExtentions = ["text/xml"];
        if (availableExtentions.includes(extention)) {
            return true;
        }
        else {
            throw new Error(`Can not read file extention -> ${extention}`);
        }
    }
}
exports.default = new RaportService;
