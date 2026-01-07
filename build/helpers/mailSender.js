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
exports.sendMailsFromCSV = exports.createTransport = exports.sendGmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const config_1 = __importDefault(require("../config/config"));
const path_1 = __importDefault(require("path"));
const Files_1 = __importDefault(require("../utils/Files"));
function timeout(ms) {
    return new Promise(resolve => { setTimeout(() => { resolve(''); }, ms); });
}
function sendGmail(data, transporter, maxTryNumber = 2, tryCount = 1) {
    return __awaiter(this, void 0, void 0, function* () {
        var mailOptions = {
            from: data.from,
            to: data.to,
            subject: data.title,
            html: data.content
        };
        try {
            yield timeout(1000);
            let mailSendingResult = yield transporter.sendMail(mailOptions);
            if (mailSendingResult.accepted.length > 0) {
                return true;
            }
            else {
                return false;
            }
        }
        catch (e) {
            console.log(e);
            if (tryCount <= maxTryNumber) {
                tryCount++;
                console.log(`Try nr. ${tryCount} sending mail for ${data.to}`);
                const result = yield sendGmail(data, transporter, maxTryNumber, tryCount);
                console.log("result");
                return result;
            }
            else {
                yield timeout(10000);
                throw new Error(e.mesasge);
            }
        }
    });
}
exports.sendGmail = sendGmail;
function createTransport(data) {
    return __awaiter(this, void 0, void 0, function* () {
        return nodemailer_1.default.createTransport({
            auth: {
                user: data.log,
                pass: data.pass
            },
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            pool: true
        });
    });
}
exports.createTransport = createTransport;
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
function cleanData(data, fRejectedMails, sendedMailsFilePath) {
    let cleanedData = [];
    const fSendedMails = JSON.parse(Files_1.default.readFileSync(sendedMailsFilePath));
    for (let dataElement of data) {
        let haveCoppy = false;
        if (!fSendedMails.find(fSendedMail => fSendedMail.email === dataElement.email) &&
            !fRejectedMails.find(fRejectedMail => fRejectedMail.email === dataElement.email)) {
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
    }
    return cleanedData;
}
function sendMailsFromCSV(filePath, maxCountryMails, otherMaxCount) {
    return __awaiter(this, void 0, void 0, function* () {
        const rejectedMailsFilePAth = path_1.default.resolve(global.mainFolderPath, "src", "db", "mails", "rejectedMails", "rejectedMails.json");
        const sendeMailsFilePath = path_1.default.resolve(global.mainFolderPath, "src", "db", "mails", "sendedMails.json");
        let fRejectedMails = JSON.parse(Files_1.default.readFileSync(rejectedMailsFilePAth));
        let rejectedMails = [];
        const mailsData = yield getCsvData(filePath);
        const cleanedData = cleanData(mailsData, rejectedMails, sendeMailsFilePath);
        let countSendedMails = 0;
        let sendedMailsCount = {};
        let sendedMails = [];
        let prevCountry = "";
        let transporter;
        for (let mailData of cleanedData) {
            const curSendeMails = sendedMailsCount[mailData.country] === undefined ? 0 : sendedMailsCount[mailData.country];
            if (maxCountryMails[mailData.country] === undefined || curSendeMails < maxCountryMails[mailData.country]) {
                if ((maxCountryMails[mailData.country] === undefined && curSendeMails < otherMaxCount) || curSendeMails < maxCountryMails[mailData.country]) {
                    for (let countryElement of config_1.default) {
                        for (let countryName of countryElement.names) {
                            let mailSended = false;
                            if (countryName === mailData.country) {
                                console.log("Start sending");
                                let rejectMailInfo = "No destination";
                                const gmailData = {
                                    log: countryElement.supportEmail.log,
                                    pass: countryElement.secretCode ? countryElement.secretCode : "",
                                    from: `EasyShop <${countryElement.supportEmail.log}>`,
                                    to: mailData.email,
                                    content: countryElement.mailText,
                                    title: countryElement.productName,
                                    imgName: countryElement.imgName
                                };
                                try {
                                    if (prevCountry != mailData.country) {
                                        if (transporter) {
                                            transporter.close();
                                            yield timeout(10000);
                                        }
                                        transporter = yield createTransport(gmailData);
                                        prevCountry = mailData.country;
                                    }
                                    mailSended = yield sendGmail(gmailData, transporter);
                                }
                                catch (error) {
                                    rejectMailInfo = error.message;
                                }
                                if (mailSended) {
                                    countSendedMails++;
                                    sendedMailsCount[mailData.country] = sendedMailsCount[mailData.country] ? sendedMailsCount[mailData.country] + 1 : 1;
                                    sendedMails.push(mailData);
                                    console.log(`Mail was sended. nr. ${countSendedMails}. ${mailData.country} - ${sendedMailsCount[mailData.country]}`);
                                }
                                else {
                                    mailData.info = rejectMailInfo;
                                    rejectedMails.push(mailData);
                                }
                            }
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
        if (rejectedMails.length > 0) {
            fRejectedMails = fRejectedMails.concat(rejectedMails);
            Files_1.default.writeFileSync(rejectedMailsFilePAth, JSON.stringify(fRejectedMails));
        }
        if (sendedMails.length > 0) {
            let fSendedMails = JSON.parse(Files_1.default.readFileSync(sendeMailsFilePath));
            Files_1.default.writeFileSync(sendeMailsFilePath, JSON.stringify(fSendedMails.concat(sendedMails)));
        }
    });
}
exports.sendMailsFromCSV = sendMailsFromCSV;
function sendMail(mailConfigData) {
}
