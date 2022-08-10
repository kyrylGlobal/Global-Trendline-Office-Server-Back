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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const raportRouter_1 = __importDefault(require("./src/routers/raportRouter"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const Logger_1 = __importDefault(require("./src/utils/Logger"));
const cors_1 = __importDefault(require("cors"));
const Cors_1 = __importDefault(require("./src/utils/Cors"));
const Errors_1 = __importDefault(require("./src/utils/Errors"));
const baselinkerRouter_1 = __importDefault(require("./src/routers/baselinkerRouter"));
const BaselinkerApiController_1 = __importDefault(require("./src/services/BaselinkerApiController"));
const baselinker_1 = require("./src/helpers/baselinker");
const DateTime_1 = __importDefault(require("./src/utils/DateTime"));
const GoogleSheetApiController_1 = __importDefault(require("./src/services/GoogleSheetApiController"));
dotenv_1.default.config();
const PORT = process.env.PORT || "5000";
const app = (0, express_1.default)();
app.use((0, cors_1.default)(Cors_1.default.allowDevCors));
app.use(Logger_1.default.logRequest());
app.use((0, express_fileupload_1.default)());
app.use("/api/raport/", raportRouter_1.default);
app.use("/api/baselinker", baselinkerRouter_1.default);
app.get('/', (req, res) => {
    res.end("Works!");
});
app.use(Errors_1.default.errorHandler);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`);
    // const fileDataXml = Files.readFileSync("./public/testFIles/at_test.xml");
    // const xmlResult = resolveSalesRaport(fileDataXml);
    // addOrdersToBaselinker();
    // sendMailsFromCSV('./src/db/mails/mails.json');
    // Files.writeFileSync('./public/testFIles/finish_at_test.xml', xmlResult);
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        const curDateime = new Date();
        const curDate = `${curDateime.getDate()}.${curDateime.getMonth() + 1}.${curDateime.getFullYear()}`;
        console.log(curDate);
        if (curDateime.getHours() === 23 && curDateime.getMinutes() > 55 && curDateime.getMinutes() < 59) {
            const lastInfo = (0, baselinker_1.getLastGoogleSheetRowNumber)();
            if (lastInfo.lastDate !== curDate) {
                const baselinkerController = new BaselinkerApiController_1.default();
                const orders = yield baselinkerController.getOrders({
                    dateFrom: DateTime_1.default.getCurDayUnix().toString()
                });
                const values = (0, baselinker_1.createValues)(orders);
                const googleApi = new GoogleSheetApiController_1.default("1lMRIjyb0Qlz4BtOaf2OQWczpDN-NxEhXNHRkLMYYJDY");
                yield googleApi.addData("Enter", `A${lastInfo.lastRow}`, values);
                (0, baselinker_1.setLastGoogleSheetRowNumber)(values.length, curDate);
            }
        }
    }), 1000 * 120);
}));
