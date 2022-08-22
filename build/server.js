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
const raportRouter_1 = __importDefault(require("./routers/raportRouter"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const Cors_1 = __importDefault(require("./utils/Cors"));
const Errors_1 = __importDefault(require("./utils/Errors"));
const baselinkerRouter_1 = __importDefault(require("./routers/baselinkerRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const PORT = process.env.PORT || "5000";
const app = (0, express_1.default)();
app.use((0, cors_1.default)(Cors_1.default.allowDevCors));
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
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
    // setInterval(() => {
    //     const curDate = new Date();
    //     console.log(`Cur time is ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`)
    // }, 1000);
    // const dateFrom = new Date(2022, 7, 6);
    // const dateTo = new Date();
    // generateHeatersStatistic(DateTime.convertDateToUnix(dateFrom), DateTime.convertDateToUnix(dateTo));
}));
