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
const Errors_1 = __importDefault(require("./utils/Errors"));
const baselinkerRouter_1 = __importDefault(require("./routers/baselinkerRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const scannerRouter_1 = __importDefault(require("./routers/scannerRouter"));
dotenv_1.default.config();
global.mainFolderPath = path_1.default.resolve(__dirname, "..");
const PORT = process.env.PORT || "5001";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, express_fileupload_1.default)());
app.use("/api/raport/", raportRouter_1.default);
app.use("/api/baselinker", baselinkerRouter_1.default);
app.use("/api/scanner", scannerRouter_1.default);
app.get('/', (req, res) => {
    res.end("Works!");
});
app.use(Errors_1.default.errorHandler);
app.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`);
    // await sendMailsFromCSV(path.resolve(__dirname, "./db/mails/mails.csv"), {
    //     "Poland": 0,
    //     "Czech Republic": 0,
    //     "Hungary": 0,
    //     "Slovakia": 0,
    //     "Bulgaria": 0,
    //     "Lithuania": 0,
    //     "Austria": 0,
    //     "Latvia": 0,
    //     "Romania": 0
    // }, 100);
}));
