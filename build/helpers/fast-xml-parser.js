"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.resolveSalesRaport = void 0;
const fast_xml_parser_1 = require("fast-xml-parser");
const c_data_rows_1 = require("../config/c-data-rows");
const config_1 = __importStar(require("../config/config"));
const jsvat_1 = require("jsvat");
const axios_1 = __importDefault(require("axios"));
const DateTime_1 = __importDefault(require("../utils/DateTime"));
const stringHelper_1 = require("./stringHelper");
const numbers_1 = require("../utils/numbers");
const atributes_1 = __importDefault(require("../config/atributes"));
const BaselinkerDb_1 = __importDefault(require("../api/BaselinkerDb"));
let midRateTemporary = {};
function resolveSalesRaport(xmlStringata, useNewVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        const xmlParseOption = {
            ignoreAttributes: false,
            parseAttributeValue: false,
            allowBooleanAttributes: true,
            unpairedTags: ["ATRYBUTY"],
            cdataPropName: 'cdata'
        };
        const xmlBuilderOption = {
            format: true,
            ignoreAttributes: false,
            unpairedTags: ["ATRYBUTY", "KWOTY_DODATKOWE"],
            suppressUnpairedNode: false,
            cdataPropName: 'cdata'
        };
        const xmlObject = new fast_xml_parser_1.XMLParser(xmlParseOption).parse(xmlStringata);
        console.log(xmlObject);
        if (useNewVersion) {
            addAttributesDescription(xmlObject.ROOT);
        }
        yield updateInvoices(xmlObject, useNewVersion); // here is the problem need to resolve async
        console.log(xmlObject);
        let xmlResult = new fast_xml_parser_1.XMLBuilder(xmlBuilderOption).build(xmlObject);
        xmlResult = replaceData(xmlResult, [
        // {
        //     key: "&lt;",
        //     value: "<"
        // }, 
        // {
        //     key: "&gt;",
        //     value: ">"
        // }
        ]);
        midRateTemporary = {};
        return xmlResult;
    });
}
exports.resolveSalesRaport = resolveSalesRaport;
function addAttributesDescription(xmlObject) {
    xmlObject.ATRYBUTY = JSON.parse(JSON.stringify(atributes_1.default));
    addCdata(xmlObject.ATRYBUTY, c_data_rows_1.attributeDescriptionCDataRows);
}
function checkVatNumber(invoiceObject) {
    const pozycje = invoiceObject.POZYCJE;
    if (invoiceObject.KRAJ.cdata !== "Polska" && invoiceObject.NIP.cdata !== "0000000000" && invoiceObject.NIP.cdata !== "") {
        let countryWasFounded = false;
        for (let countryElement of config_1.default) {
            countryElement.names.forEach(countryName => {
                if (countryName === invoiceObject.KRAJ.cdata) {
                    if (pozycje.POZYCJA) { // optimise
                        let vatCheckResult = (0, jsvat_1.checkVAT)(`${countryElement.shortName}${invoiceObject.NIP.cdata}`, [countryElement.viesConfig]);
                        if (invoiceObject.KOREKTA === "Tak") {
                            if (pozycje.POZYCJA.length > 1 && ((pozycje.POZYCJA.length % 2) === 0)) {
                                const pozSum = pozycje.POZYCJA.reduce((previous, current) => { return previous + current; }, 0);
                                if ((pozSum > -1 && pozSum < 1)) {
                                    if (!vatCheckResult.isValid && pozycje.POZYCJA[pozycje.POZYCJA.length / 2].STAWKA_VAT !== 0) {
                                        throw new Error(`Error! Please check vat rate for invoice ${invoiceObject.ID_ZRODŁA}. Vat rate should be 0%`);
                                    }
                                }
                            }
                        }
                        else {
                            if (pozycje.POZYCJA.length > 0 && pozycje.POZYCJA[0].STAWKA_VAT != 0) {
                                throw new Error(`Error! Please check vat rate for invoice ${invoiceObject.ID_ZRODŁA}. Vat rate should be 0%`);
                            }
                        }
                    }
                    countryWasFounded = true;
                }
            });
        }
        if (!countryWasFounded) {
            throw new Error(`Error! Please check country configuration in config file. Invoice ${invoiceObject.ID_ZRODLA.cdata} with country ${invoiceObject.KRAJ.cdata}`);
        }
    }
}
function checkInvoice(invoiceObject) {
    checkCurrencyAndCountry(invoiceObject);
    //checkVatNumber(invoiceObject);
}
function checkCurrencyAndCountry(invoiceObject) {
    try {
        if (invoiceObject.PLATNOSCI.PLATNOSC) {
            let invoiceCurrency = invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT.cdata;
            let orderCurrency = invoiceObject.WALUTA.cdata;
            let invoiceCountry = invoiceObject.KRAJ.cdata;
            let countryWasFounded = false;
            config_1.default.every(countryElement => {
                countryElement.names.forEach(countryName => {
                    if (countryName === invoiceCountry) {
                        if (countryElement.currency === invoiceCurrency && countryElement.currency === orderCurrency) {
                            countryWasFounded = true;
                            return false;
                        }
                        else {
                            if (!countryElement.errorToIgnore.includes(config_1.ErrorTypes.CURENCYERROR)) { // if not ignore
                                countryWasFounded = true;
                                return false;
                            }
                            else if (!countryElement.factureToIgnoreError.includes(invoiceObject.ID_ZRODLA.cdata)) {
                                throw new Error(`For invoice ${invoiceObject.ID_ZRODLA.cdata} true coutry curensy is ${countryElement.currency}. Real order curency is ${orderCurrency} nad real invoice curensy is ${invoiceCurrency}`);
                            }
                            else
                                countryWasFounded = true;
                        }
                    }
                });
                return true;
            });
            if (!countryWasFounded) {
                throw new Error(`Error! Can not found config for counry ${invoiceCountry} and currency ${invoiceCurrency}`);
            }
        }
    }
    catch (error) {
        console.log(error.message);
        throw new Error(error.message);
    }
}
function updateInvoices(xmlObject, useNewVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        let responseData = {};
        let invoices = [];
        if (Array.isArray(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT)) {
            if (useNewVersion) {
                responseData = yield (new BaselinkerDb_1.default().getInvoiceDataByInvoiceNumbers(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT.map((inv) => inv.ID_ZRODLA.cdata)));
            }
            invoices.push(...xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT);
        }
        else {
            if (useNewVersion) {
                responseData = yield (new BaselinkerDb_1.default().getInvoiceDataByInvoiceNumbers([xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT.ID_ZRODLA.cdata]));
            }
            invoices.push(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT);
        }
        for (let invoiceObject of invoices) {
            yield updateInvoice(invoiceObject, responseData, useNewVersion);
        }
    });
}
function updateInvoice(invoiceObject, attributesData, useNewVersion) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateConversion(invoiceObject);
        updatePaymentType(invoiceObject);
        updatePaymentSection(invoiceObject);
        updateVatNumber(invoiceObject);
        updateVatCountry(invoiceObject);
        yield updateInvoiceDates(invoiceObject);
        updatePrices(invoiceObject);
        updatePaymentCurrency(invoiceObject);
        if (useNewVersion) {
            yield addAttributes(invoiceObject, attributesData);
        }
        checkInvoice(invoiceObject);
        updateFinishedJObject(invoiceObject);
    });
}
function addAttributes(invoiceObject, attributesData) {
    return __awaiter(this, void 0, void 0, function* () {
        const invoiceData = attributesData[invoiceObject.ID_ZRODLA.cdata];
        if (invoiceData) {
            invoiceObject.ATRYBUTY = {
                ATRYBUT: [
                    {
                        KOD_ATR: 'NUMER ZAMOWIENIA SKL',
                        ID_ZRODLA_ATR: 'CED4DFCD-5CBC-4E9B-947E-4E2AFEE5D08E',
                        WARTOSC: isPrivateStore(invoiceData.orderSource, invoiceData.orderSourceId) ? invoiceData.extraFieldOne : invoiceData.storeOrderId
                    },
                    {
                        KOD_ATR: 'NUMER ZAMOWIENIA BAS',
                        ID_ZRODLA_ATR: '9A998639-A814-452C-962E-9A28DD935417',
                        WARTOSC: invoiceData.baselinkerOrderId
                    },
                    {
                        KOD_ATR: 'LOGIN KLIENTA',
                        ID_ZRODLA_ATR: '59D8B122-AB51-4440-91F4-ED7A15C3FD57',
                        WARTOSC: invoiceData.userLogin
                    }
                ]
            };
        }
        else {
            console.log(`Unable to find invoice data for invoice ${invoiceObject.ID_ZRODLA.cdata}`);
        }
    });
}
function isPrivateStore(orderSource, orderSourceId) {
    const privateStoreIds = ['7408', '7517'];
    if (orderSource === 'personal' && privateStoreIds.includes(orderSourceId)) {
        return true;
    }
    return false;
}
function getAttributesInvoiceDataByInvoiceNumber(invoiceNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        const responseData = yield (new BaselinkerDb_1.default().getInvoiceDataByInvoiceNumbers([invoiceNumber]));
        if (responseData[invoiceNumber]) {
            return responseData[invoiceNumber];
        }
        return null;
    });
}
function updatePaymentSection(invoiceObject) {
    if (invoiceObject.PLATNOSCI.PLATNOSC) {
        let paymentSection = invoiceObject.PLATNOSCI.PLATNOSC;
        if (invoiceObject.KRAJ.cdata === "Polska") {
            paymentSection.WALUTA_PLAT.cdata = "";
            paymentSection.KURS_WALUTY_PLAT.cdata = "";
        }
    }
}
function updatePaymentCurrency(invoiceObject) {
    return __awaiter(this, void 0, void 0, function* () {
        if (invoiceObject.PLATNOSCI.PLATNOSC) {
            if (invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT.cdata === "") {
                const countryObject = (0, config_1.getCountryObjectIfName)(invoiceObject.KRAJ.cdata);
                if (countryObject) {
                    if (!countryObject.names.includes("Polska")) {
                        invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT.cdata = countryObject.currency;
                    }
                }
            }
        }
    });
}
function updateConversion(invoiceObject, shouldChangeAnyway = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!invoiceObject.NOTOWANIE_WALUTY_ILE_2 || shouldChangeAnyway) {
            const lookingCountryObj = (0, config_1.getCountryObjectIfName)(invoiceObject.KRAJ.cdata);
            if (lookingCountryObj && !lookingCountryObj.names.includes("Polska")) {
                if (lookingCountryObj) {
                    let posSum = { posSumBrutto: 0, posSumNetto: 0 };
                    const exchangeDate = createExchangeDate(invoiceObject.DATA_SPRZEDAZY.cdata);
                    const midRate = yield getMidRate(lookingCountryObj.convCurGetRequestWay, exchangeDate); //(await axios.get(`${lookingCountryObj.convCurGetRequestWay}/${invoiceObject.DATA_KURSU}`, {params: {format: "json"}})).data.rates[0].mid; 
                    console.log(`The midrate of ${midRate.date} is ${midRate.rate}`);
                    if (midRate.rate) {
                        if (invoiceObject.POZYCJE && invoiceObject.POZYCJE.POZYCJA) {
                            const positions = invoiceObject.POZYCJE.POZYCJA;
                            if (Array.isArray(positions)) {
                                for (let position of positions) {
                                    updatePositionConvertion(position, midRate.rate, posSum);
                                }
                            }
                            else {
                                updatePositionConvertion(positions, midRate.rate, posSum);
                            }
                        }
                        invoiceObject.NOTOWANIE_WALUTY_ILE_2 = addZeroToTheEnd(midRate.rate, 6);
                        invoiceObject.NOTOWANIE_WALUTY_ILE = addZeroToTheEnd(midRate.rate, 6);
                        invoiceObject.DATA_KURSU.cdata = midRate.date;
                        invoiceObject.DATA_KURSU_2.cdata = midRate.date;
                        if (invoiceObject.PLATNOSCI.PLATNOSC) {
                            invoiceObject.PLATNOSCI.PLATNOSC.NOTOWANIE_WALUTY_ILE_PLAT = addZeroToTheEnd(midRate.rate, 6);
                            invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT = parseFloat((midRate.rate * invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT).toFixed(2));
                            const difference = posSum.posSumBrutto + posSum.posSumNetto - invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT;
                            if (difference < 0.1) {
                                invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT = invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT + difference;
                            }
                            else if (difference > 0.1) {
                                throw new Error(`Brutto positions summ is not equel to field PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT. Invoice ${invoiceObject.ID_ZRODLA.cdata}`);
                            }
                        }
                    }
                    else {
                        throw new Error(`Can not get conversion data for invoice ${invoiceObject.ID_ZRODLA.cdata}. Please try by your own.`);
                    }
                }
                else {
                    throw new Error(`Error! Please add ${invoiceObject.KRAJ.cdata} to config names`);
                }
            }
        }
    });
}
function updatePositionConvertion(position, rate, posSum) {
    position.NETTO_SYS = (0, numbers_1.floatMultiply)([position.NETTO, rate]);
    position.NETTO_SYS2 = position.NETTO_SYS;
    posSum.posSumNetto = (0, numbers_1.floatSum)([position.NETTO_SYS, posSum.posSumNetto]);
    position.VAT_SYS = (0, numbers_1.floatMultiply)([position.VAT, rate]);
    position.VAT_SYS2 = position.VAT_SYS;
    posSum.posSumBrutto = (0, numbers_1.floatSum)([position.VAT_SYS, posSum.posSumBrutto]);
}
function addZeroToTheEnd(value, maxLengthAfterDod) {
    if (typeof value === 'number') {
        value = value.toString();
    }
    let delimeter = '';
    if (value.includes('.')) {
        delimeter = '.';
    }
    else if (value.includes(',')) {
        delimeter = ',';
    }
    let valueArray;
    if (delimeter) {
        valueArray = value.split(delimeter);
    }
    else {
        valueArray = [value, ''];
    }
    valueArray[1] = valueArray[1].padEnd(maxLengthAfterDod, '0');
    return valueArray.join('.');
}
function createExchangeDate(sellDate) {
    //2022-01-31
    let date = new Date(sellDate);
    date.setDate(date.getDate() - 1);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
function getMidRate(adres, date) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!adres) {
            throw new Error("Error! Please add convCurGetRequestWay par. data to this country.");
        }
        try {
            if (midRateTemporary[date] && midRateTemporary[date].available) {
                return { rate: midRateTemporary[date].rate, date: date };
            }
            else if (midRateTemporary[date] && midRateTemporary[date].available === false) {
                return yield getMidRate(adres, DateTime_1.default.updateDate(date, { days: -1, mounth: 0, years: 0 }));
            }
            else {
                let midRate = (yield axios_1.default.get(`${adres}/${date}`, { params: { format: "json" } })).data.rates[0].mid;
                midRateTemporary[date] = { available: true, date: date, rate: midRate };
                return { date: date, rate: midRate };
            }
        }
        catch (error) {
            console.log(`Problem with adres ${adres}/${date}`);
            if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                yield (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return new Promise((res, rej) => setTimeout(res, 2000));
                    });
                })();
                return yield getMidRate(adres, date);
            }
            midRateTemporary[date] = { available: false, date: date, rate: 0 };
            return yield getMidRate(adres, DateTime_1.default.updateDate(date, { days: -1, mounth: 0, years: 0 }));
        }
    });
}
function updatePrices(invoiceObject) {
    const invoicePositions = invoiceObject.POZYCJE.POZYCJA;
    if (invoiceObject.KOREKTA === "Nie" && invoiceObject.PLATNOSCI) {
        if (Array.isArray(invoiceObject.POZYCJE.POZYCJA)) {
            let sumFromPos = 0;
            let sumFromInvoice = invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT;
            for (let pos of invoiceObject.POZYCJE.POZYCJA) {
                sumFromPos += pos.NETTO + pos.VAT;
            }
            if (sumFromPos !== sumFromInvoice) {
                const difference = +((sumFromInvoice - sumFromPos).toFixed(2));
                invoiceObject.POZYCJE.POZYCJA[0].NETTO = +((invoiceObject.POZYCJE.POZYCJA[0].NETTO + difference).toFixed(2));
            }
        }
    }
    else if (invoiceObject.KOREKTA === "Tak" && Array.isArray(invoicePositions)) {
        let difference = 0;
        invoicePositions.forEach(position => difference += position.NETTO + position.VAT);
        if (difference > -1 && difference < 1) {
            invoicePositions[0].NETTO = +((invoicePositions[0].NETTO - difference)).toFixed(2);
        }
    }
}
function updateInvoiceDates(invoiceObject) {
    return __awaiter(this, void 0, void 0, function* () {
        if (invoiceObject.KOREKTA === "Nie") {
            if (invoiceObject.DATA_WYSTAWIENIA.cdata != invoiceObject.DATA_SPRZEDAZY.cdata) {
                const dateOfCreationArray = invoiceObject.DATA_WYSTAWIENIA.cdata.split("-");
                invoiceObject.DATA_SPRZEDAZY.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                invoiceObject.TERMIN.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                invoiceObject.DATA_KURSU.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                invoiceObject.DATA_KURSU_2.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                invoiceObject.DEKLARACJA_VAT7 = `${dateOfCreationArray[0]}-${dateOfCreationArray[1]}`;
                invoiceObject.DATA_DATAOBOWIAZKUPODATKOWEGO.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                invoiceObject.DATA_DATAPRAWAODLICZENIA.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                if (invoiceObject.PLATNOSCI) {
                    invoiceObject.PLATNOSCI.PLATNOSC.TERMIN_PLAT.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                    invoiceObject.PLATNOSCI.PLATNOSC.DATA_KURSU_PLAT.cdata = invoiceObject.DATA_KURSU.cdata;
                }
            }
        }
    });
}
function updatePaymentType(invoiceObject) {
    for (let countryConfig of config_1.default) {
        if (countryConfig.names.includes(invoiceObject.KRAJ.cdata)) {
            let paymentMethod = null;
            for (let countryPaymentMethod of countryConfig.paymentMethods) {
                if ((0, stringHelper_1.checkIfContainText)(countryPaymentMethod.keyWord, invoiceObject.FORMA_PLATNOSCI.cdata)) {
                    paymentMethod = countryPaymentMethod.changeTo;
                    break;
                }
            }
            if (paymentMethod === null) {
                throw new Error(`please add config for payment method ${invoiceObject.FORMA_PLATNOSCI.cdata} for country ${countryConfig.shortName}. Invoice id - ${invoiceObject.ID_ZRODLA.cdata}. Invoice name - ${invoiceObject.NAZWA1.cdata}`);
            }
            invoiceObject.FORMA_PLATNOSCI.cdata = paymentMethod;
            if (invoiceObject.PLATNOSCI.PLATNOSC) {
                invoiceObject.PLATNOSCI.PLATNOSC.FORMA_PLATNOSCI_PLAT.cdata = paymentMethod;
            }
            break;
        }
    }
}
function updateVatCountry(invoiceObject) {
    if (!invoiceObject.NIP_KRAJ.cdata) {
        for (const countryElement of config_1.default) {
            for (let countryName of countryElement.names) {
                if (countryName === invoiceObject.KRAJ.cdata) {
                    invoiceObject.NIP_KRAJ.cdata = countryElement.shortName;
                    return;
                }
            }
        }
        if (!invoiceObject.KRAJ.cdata) {
            throw new Error(`Invoice with number ${invoiceObject.ID_ZRODLA.cdata} does not contain invoice country`);
        }
        else {
            throw new Error(`Can not find country of invoice with number ${invoiceObject.ID_ZRODLA.cdata} inside country config. Please add ${invoiceObject.KRAJ.cdata} to config.`);
        }
    }
}
function updateVatNumber(invoiceObject) {
    if (!invoiceObject.NIP.cdata) {
        invoiceObject.NIP.cdata = "0000000000";
    }
}
function updateFinishedJObject(invoiceObject) {
    // addCdata(invoiceObject, cDataRows);
}
function replaceData(data, dataToReplace) {
    for (const replace of dataToReplace) {
        data = data.replace(new RegExp(replace.key, "g"), replace.value);
    }
    return data;
}
function addCdata(jXmlObject, rules) {
    for (const [key, value] of Object.entries(jXmlObject)) {
        if (typeof jXmlObject[key] !== "object") {
            if (rules.includes(key)) {
                jXmlObject[key] = `<![CDATA[${value}]]>`;
            }
        }
        else if (typeof jXmlObject[key] === "object") {
            addCdata(jXmlObject[key], rules);
        }
    }
}
