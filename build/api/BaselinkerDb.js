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
const axios_1 = __importDefault(require("axios"));
class BaselinkerDb {
    getInvoiceDataByInvoiceNumbers(invoicesNumbers) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post('https://global-trenline-tech.xyz/admin/api/v1/openApi/get/accountant/invoices/data', { invoices: invoicesNumbers });
                const body = response.data;
                if (body.error) {
                    throw new Error(`Unable to collect invoices data. Message: ${body.message}`);
                }
                return body.data;
            }
            catch (e) {
                throw new Error(`Unable to collect invoices data. Message: ${e.message}`);
            }
        });
    }
}
exports.default = BaselinkerDb;
