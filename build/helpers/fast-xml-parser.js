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
const c_data_rows_1 = __importDefault(require("../config/c-data-rows"));
const config_1 = __importStar(require("../config/config"));
const jsvat_1 = require("jsvat");
const axios_1 = __importDefault(require("axios"));
const DateTime_1 = __importDefault(require("../utils/DateTime"));
function resolveSalesRaport(xmlStringata) {
    return __awaiter(this, void 0, void 0, function* () {
        const xmlParseOption = {
            ignoreAttributes: false,
            parseAttributeValue: false,
            allowBooleanAttributes: true,
            unpairedTags: ["ATRYBUTY"]
        };
        const xmlBuilderOption = {
            format: true,
            ignoreAttributes: false,
            unpairedTags: ["ATRYBUTY", "KWOTY_DODATKOWE"],
            suppressUnpairedNode: false
        };
        const xmlObject = new fast_xml_parser_1.XMLParser(xmlParseOption).parse(xmlStringata);
        yield updateInvoices(xmlObject); // here is the problem need to resolve async
        let xmlResult = new fast_xml_parser_1.XMLBuilder(xmlBuilderOption).build(xmlObject);
        xmlResult = replaceData(xmlResult, [
            {
                key: "&lt;",
                value: "<"
            },
            {
                key: "&gt;",
                value: ">"
            }
        ]);
        return xmlResult;
    });
}
exports.resolveSalesRaport = resolveSalesRaport;
function checkVatNumber(invoiceObject) {
    const pozycje = invoiceObject.POZYCJE;
    if (invoiceObject.KRAJ !== "Polska" && invoiceObject.NIP !== "0000000000" && invoiceObject.NIP !== "") {
        let countryWasFounded = false;
        for (let countryElement of config_1.default) {
            countryElement.names.forEach(countryName => {
                if (countryName === invoiceObject.KRAJ) {
                    if (pozycje.POZYCJA) { // optimise
                        let vatCheckResult = (0, jsvat_1.checkVAT)(`${countryElement.shortName}${invoiceObject.NIP}`, [countryElement.viesConfig]);
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
            throw new Error(`Error! Please check country configuration in config file. Invoice ${invoiceObject.ID_ZRODLA} with country ${invoiceObject.KRAJ}`);
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
            let invoiceCurrency = invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT;
            let invoiceCountry = invoiceObject.KRAJ;
            let countryWasFounded = false;
            config_1.default.every(countryElement => {
                countryElement.names.forEach(countryName => {
                    if (countryName === invoiceCountry) {
                        if (countryElement.currency === invoiceCurrency) {
                            countryWasFounded = true;
                            return false;
                        }
                        else {
                            throw new Error(`Error! Facture ${invoiceObject.ID_ZRODLA} contain country ${invoiceCountry} with ${invoiceCurrency}`);
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
        console.log(error);
    }
}
function updateInvoices(xmlObject) {
    return __awaiter(this, void 0, void 0, function* () {
        if (Array.isArray(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT)) {
            for (let invoiceObject of xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT) {
                yield updateInvoice(invoiceObject);
            }
        }
        else {
            let invoiceObject = xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT;
            yield updateInvoice(invoiceObject);
        }
    });
}
function updateInvoice(invoiceObject) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateConversion(invoiceObject);
        updatePaymentType(invoiceObject);
        updateVatNumber(invoiceObject);
        updateVatCountry(invoiceObject);
        yield updateInvoiceDates(invoiceObject);
        updatePrices(invoiceObject);
        updatePaymentCurrency(invoiceObject);
        checkInvoice(invoiceObject);
        updateFinishedJObject(invoiceObject);
    });
}
function updatePaymentCurrency(invoiceObject) {
    return __awaiter(this, void 0, void 0, function* () {
        if (invoiceObject.PLATNOSCI.PLATNOSC) {
            if (invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT === "") {
                const countryObject = (0, config_1.getCountryObjectIfName)(invoiceObject.KRAJ);
                if (countryObject) {
                    invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT = countryObject.currency;
                }
            }
        }
    });
}
function updateConversion(invoiceObject, shouldChangeAnyway = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (invoiceObject.NOTOWANIE_WALUTY_ILE_2 === 0 || shouldChangeAnyway) {
            const lookingCountryObj = (0, config_1.getCountryObjectIfName)(invoiceObject.KRAJ);
            if (lookingCountryObj && !lookingCountryObj.names.includes("Polska")) {
                if (lookingCountryObj) {
                    const midRate = yield getMidRate(lookingCountryObj.convCurGetRequestWay, invoiceObject.DATA_KURSU); //(await axios.get(`${lookingCountryObj.convCurGetRequestWay}/${invoiceObject.DATA_KURSU}`, {params: {format: "json"}})).data.rates[0].mid; 
                    console.log(`The midrate of ${invoiceObject.DATA_KURSU} is ${midRate}`);
                    if (midRate) {
                        invoiceObject.NOTOWANIE_WALUTY_ILE_2 = midRate;
                        invoiceObject.NOTOWANIE_WALUTY_ILE = midRate;
                        if (invoiceObject.PLATNOSCI.PLATNOSC) {
                            invoiceObject.PLATNOSCI.PLATNOSC.NOTOWANIE_WALUTY_ILE_PLAT = midRate;
                            invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT = parseFloat((midRate * invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT).toFixed(2));
                        }
                    }
                    else {
                        throw new Error(`Can not get conversion data for invoice ${invoiceObject.ID_ZRODLA}. Please try by your own.`);
                    }
                }
                else {
                    throw new Error(`Error! Please add ${invoiceObject.KRAJ} to config names`);
                }
            }
        }
    });
}
//NOTOWANIE_WALUTY_ILE_2 - mid rate
//PLATNOSCI -> PLATNOSC -> NOTOWANIE_WALUTY_ILE_PLAT - mid rate
//PLATNOSCI -> PLATNOSC -> KWOTA_PLN_PLAT - (PLATNOSCI -> PLATNOSC -> NOTOWANIE_WALUTY_ILE_PLAT) * (PLATNOSCI -> PLATNOSC -> KWOTA_PLAT)
function getMidRate(adres, date) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!adres) {
            throw new Error("Error! Please add convCurGetRequestWay par. data to this country.");
        }
        try {
            const midRate = (yield axios_1.default.get(`${adres}/${date}`, { params: { format: "json" } })).data.rates[0].mid;
            return midRate;
        }
        catch (error) {
            console.log(`Problem with adres ${adres}/${date}`);
            if (((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                yield (function () {
                    return __awaiter(this, void 0, void 0, function* () {
                        return new Promise((res, rej) => setTimeout(res, 2000));
                    });
                })();
                return getMidRate(adres, date);
            }
            return getMidRate(adres, DateTime_1.default.updateDate(date, { days: -1, mounth: 0, years: 0 }));
        }
    });
}
function updatePrices(invoiceObject) {
    const invoicePositions = invoiceObject.POZYCJE.POZYCJA;
    if (invoiceObject.KOREKTA === "Nie") {
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
            if (invoiceObject.DATA_WYSTAWIENIA != invoiceObject.DATA_SPRZEDAZY) {
                const dateOfCreationArray = invoiceObject.DATA_WYSTAWIENIA.split("-");
                invoiceObject.DATA_SPRZEDAZY = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.TERMIN = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.DATA_KURSU = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.DATA_KURSU_2 = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.DEKLARACJA_VAT7 = `${dateOfCreationArray[0]}-${dateOfCreationArray[1]}`;
                invoiceObject.DATA_DATAOBOWIAZKUPODATKOWEGO = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.DATA_DATAPRAWAODLICZENIA = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.PLATNOSCI.PLATNOSC.TERMIN_PLAT = invoiceObject.DATA_WYSTAWIENIA;
                invoiceObject.PLATNOSCI.PLATNOSC.DATA_KURSU_PLAT = invoiceObject.DATA_KURSU;
                yield updateConversion(invoiceObject, true);
            }
        }
    });
}
function updatePaymentType(invoiceObject) {
    invoiceObject.FORMA_PLATNOSCI = "Przelew";
}
function updateVatCountry(invoiceObject) {
    if (!invoiceObject.NIP_KRAJ) {
        for (const countryElement of config_1.default) {
            for (let countryName of countryElement.names) {
                if (countryName === invoiceObject.KRAJ) {
                    invoiceObject.NIP_KRAJ = countryElement.shortName;
                    return;
                }
            }
        }
        if (!invoiceObject.KRAJ) {
            throw new Error(`Invoice with number ${invoiceObject.ID_ZRODLA} does not contain invoice country`);
        }
        else {
            throw new Error(`Can not find country of invoice with number ${invoiceObject.ID_ZRODLA} inside country config. Please add ${invoiceObject.KRAJ} to config.`);
        }
    }
}
function updateVatNumber(invoiceObject) {
    if (!invoiceObject.NIP) {
        invoiceObject.NIP = "0000000000";
    }
}
function updateFinishedJObject(invoiceObject) {
    addCdata(invoiceObject);
}
function replaceData(data, dataToReplace) {
    for (const replace of dataToReplace) {
        data = data.replace(new RegExp(replace.key, "g"), replace.value);
    }
    return data;
}
function addCdata(jXmlObject) {
    for (const [key, value] of Object.entries(jXmlObject)) {
        if (typeof jXmlObject[key] !== "object") {
            if (c_data_rows_1.default.includes(key)) {
                jXmlObject[key] = `<![CDATA[${value}]]>`;
            }
        }
        else if (typeof jXmlObject[key] === "object") {
            addCdata(jXmlObject[key]);
        }
    }
}
