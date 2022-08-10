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
const googleapis_1 = require("googleapis");
class Google {
    constructor(spreadSheetId) {
        this.spreadsheetId = spreadSheetId;
    }
    addData(sheetName, range, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const auth = new googleapis_1.google.auth.GoogleAuth({
                keyFile: "keys.json",
                scopes: "https://www.googleapis.com/auth/spreadsheets"
            });
            const authClientObject = yield auth.getClient();
            const instance = googleapis_1.google.sheets({ version: "v4", auth: authClientObject });
            yield instance.spreadsheets.values.append({
                auth: auth,
                spreadsheetId: this.spreadsheetId,
                range: `${sheetName}!${range}`,
                valueInputOption: "RAW",
                requestBody: {
                    values: values
                }
            });
        });
    }
}
exports.default = Google;
