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
const path_1 = __importDefault(require("path"));
const DateTime_1 = __importDefault(require("./DateTime"));
const Files_1 = __importDefault(require("./Files"));
class Logger {
    constructor() {
        this.requestLogFilePath = path_1.default.resolve(process.cwd(), "public", "logs", 'requestLogs.txt');
    }
    logRequest() {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const info = `[${DateTime_1.default.getCurDate()}],[${DateTime_1.default.getCurTime()}]-[${req.method}],[${req.url}],[${req.ips},[${req.get("user-agent")}]]`;
                yield Files_1.default.appendFile(this.requestLogFilePath, `${info}\n`);
                next();
            }
            catch (error) {
                next(new Error(error));
            }
        });
    }
}
exports.default = new Logger();
