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
exports.sendMailsFromCSV = exports.sendGmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const config_1 = __importDefault(require("../config/config"));
function timeout(ms) {
    return new Promise(resolve => { setTimeout(() => { resolve(''); }, ms); });
}
function sendGmail(data) {
    return __awaiter(this, void 0, void 0, function* () {
        var transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: data.log,
                pass: data.pass
            }
        });
        var mailOptions = {
            from: data.from,
            to: data.to,
            subject: data.title,
            text: data.content
        };
        let mailSendingResult = yield transporter.sendMail(mailOptions);
        if (mailSendingResult.accepted.length > 0) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.sendGmail = sendGmail;
function getCsvData(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            let rows = [];
            fs_1.default.createReadStream(filePath)
                .pipe((0, csv_parser_1.default)())
                .on('data', (row) => __awaiter(this, void 0, void 0, function* () {
                rows.push(row);
            }))
                .on('end', () => {
                resolve(rows);
            });
        });
    });
}
function jsonData(filePath) {
    let fileData = fs_1.default.readFileSync(filePath, { encoding: 'utf8' });
    return JSON.parse(fileData);
}
function cleanData(data) {
    let cleanedData = [];
    for (let dataElement of data) {
        let haveCoppy = false;
        for (let cleanedDataElement of cleanedData) {
            if (cleanedDataElement.email === dataElement.email) {
                haveCoppy = true;
                break;
            }
        }
        if (!haveCoppy) {
            cleanedData.push(dataElement);
        }
    }
    return cleanedData;
}
function sendMailsFromCSV(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        let rejectedMails = [];
        const mailsData = jsonData(filePath);
        const cleanedData = cleanData(mailsData);
        let countSendedMails = 0;
        let sendedMailsCount = {};
        for (let mailData of mailsData) {
            for (let countryElement of config_1.default) {
                for (let countryName of countryElement.names) {
                    let mailSended = false;
                    if (countryName === mailData.country) {
                        yield timeout(500);
                        console.log("Start sending");
                        try {
                            mailSended = yield sendGmail({
                                log: countryElement.supportEmail.log,
                                pass: countryElement.supportEmail.pas,
                                from: `EasyShop <${countryElement.supportEmail.log}>`,
                                to: mailData.email,
                                content: `${mailData.name}, ${countryElement.mailText}`,
                                title: countryElement.productName
                            });
                        }
                        catch (error) {
                            console.log("Failed sending");
                        }
                        if (mailSended) {
                            countSendedMails++;
                            console.log(`Mail was sended. nr. ${countSendedMails}`);
                            sendedMailsCount[mailData.country] = sendedMailsCount[mailData.country] ? sendedMailsCount[mailData.country] + 1 : 1;
                        }
                        else {
                            rejectedMails.push(mailData);
                        }
                    }
                }
            }
        }
        for (let key of Object.keys(sendedMailsCount)) {
            console.log(`${key} -> ${sendedMailsCount[key]}`);
        }
        console.log(`Rejected - ${rejectedMails.length}`);
        console.log(rejectedMails.length > 0 ? JSON.stringify(rejectedMails) : "");
    });
}
exports.sendMailsFromCSV = sendMailsFromCSV;
