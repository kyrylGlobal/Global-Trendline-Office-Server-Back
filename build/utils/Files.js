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
const fs_1 = __importDefault(require("fs"));
class Files {
    appendFile(path, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.appendFile(path, data, (error) => {
                    if (error) {
                        reject(`Problem with request log write data to file! File path - ${path}`);
                    }
                    resolve(true);
                });
            });
        });
    }
    readFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(path, { encoding: 'utf8' }, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    resolve(data);
                });
            });
        });
    }
    readFileSync(path) {
        return fs_1.default.readFileSync(path, { encoding: "utf8" });
    }
    writeFileSync(path, data) {
        fs_1.default.writeFileSync(path, data, { encoding: "utf8" });
    }
}
exports.default = new Files();
