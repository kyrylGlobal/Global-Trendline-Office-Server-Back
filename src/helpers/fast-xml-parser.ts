import { X2jOptions, XMLBuilder, XmlBuilderOptions, XMLParser } from "fast-xml-parser";
import cDataRows, { attributeDescriptionCDataRows } from "../config/c-data-rows";
import country, {ifContainCountryName, getCountryObjectIfName, ErrorTypes} from "../config/config";
import {checkVAT} from 'jsvat'
import axios from "axios";
import DateTime from "../utils/DateTime";
import { checkIfContainText } from "./stringHelper";
import { floatMultiply, floatSum } from "../utils/numbers";
import attributesDescription from "../config/atributes";
import { GetInvoiceAccountantDataResponseBody, InvoiceAccountantData } from "../types";
import BaselinkerDb from "../api/BaselinkerDb";

interface KeyAndValue {
    key: string,
    value: string
}

let midRateTemporary: {
    [key: string]: {
        date: string,
        rate: number,
        available: boolean
    }
} = {};

export async function resolveSalesRaport(xmlStringata: string, useNewVersion: boolean): Promise<string> {
    const xmlParseOption: Partial<X2jOptions> = {
        ignoreAttributes: false,
        parseAttributeValue: false,
        allowBooleanAttributes: true, // atributes without value,
        unpairedTags: ["ATRYBUTY"],
        cdataPropName: 'cdata',
        // preserveOrder: true
    }//asd
    const xmlBuilderOption: Partial<XmlBuilderOptions> = {
        ignoreAttributes: false,
        unpairedTags: ["ATRYBUTY", "KWOTY_DODATKOWE"],
        suppressUnpairedNode: false,
        cdataPropName: 'cdata',
        format: true
        // preserveOrder: true
    }

    const xmlObject: any = new XMLParser(xmlParseOption).parse(xmlStringata);
    if(useNewVersion) {
        addAttributesDescription(xmlObject.ROOT);
    }

    await updateInvoices(xmlObject, useNewVersion); // here is the problem need to resolve async
    
    let xmlResult = new XMLBuilder(xmlBuilderOption).build(xmlObject);
    
    xmlResult = replaceData(
        xmlResult,
        [
            {
                key: "\\n\\s*<!\\[CDATA",
                value: "\<\![CDATA"
            }, 
            {
                key: "]]>\\n\\s*",
                value: "]]>"
            }
        ]
    )

    midRateTemporary = {}

    return xmlResult;
}

function addAttributesDescription(xmlObject: any) {
    xmlObject.ATRYBUTY = JSON.parse(JSON.stringify(attributesDescription));

    addCdata(xmlObject.ATRYBUTY, attributeDescriptionCDataRows);
}

function checkVatNumber(invoiceObject: any) {
    const pozycje = invoiceObject.POZYCJE;
    if(invoiceObject.KRAJ.cdata !== "Polska" && invoiceObject.NIP.cdata !== "0000000000" && invoiceObject.NIP.cdata !== "") {
        let countryWasFounded = false;
        for(let countryElement of country) {
            countryElement.names.forEach( countryName => {
                if(countryName === invoiceObject.KRAJ.cdata) {
                    if(pozycje.POZYCJA) { // optimise
                        let vatCheckResult = checkVAT(`${countryElement.shortName}${invoiceObject.NIP.cdata}`, [countryElement.viesConfig])
                        if(invoiceObject.KOREKTA === "Tak") {
                            if(pozycje.POZYCJA.length > 1 && ((pozycje.POZYCJA.length % 2) === 0)) {
                                const pozSum = (pozycje.POZYCJA as Array<any>).reduce((previous, current) => { return previous + current}, 0)
                                if((pozSum > -1 && pozSum < 1)) {
                                    if(!vatCheckResult.isValid && pozycje.POZYCJA[pozycje.POZYCJA.length / 2].STAWKA_VAT !== 0) {
                                        throw new Error(`Error! Please check vat rate for invoice ${invoiceObject.ID_ZRODŁA}. Vat rate should be 0%`);
                                    } 
                                }
                            }
                        } else {
                            if(pozycje.POZYCJA.length > 0 && pozycje.POZYCJA[0].STAWKA_VAT != 0) {
                                throw new Error(`Error! Please check vat rate for invoice ${invoiceObject.ID_ZRODŁA}. Vat rate should be 0%`);
                            }
                        }
                    }
                    countryWasFounded = true;
                }
            })
        }

        if(!countryWasFounded) {
            throw new Error(`Error! Please check country configuration in config file. Invoice ${invoiceObject.ID_ZRODLA.cdata} with country ${invoiceObject.KRAJ.cdata}`);
        }
    }
}

function checkInvoice(invoiceObject: any) {
    checkCurrencyAndCountry(invoiceObject);
    //checkVatNumber(invoiceObject);
}

function checkCurrencyAndCountry(invoiceObject: any) {
    try {
        if(invoiceObject.PLATNOSCI.PLATNOSC) {
            let invoiceCurrency = invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT.cdata;
            let orderCurrency = invoiceObject.WALUTA.cdata;
            let invoiceCountry = invoiceObject.KRAJ.cdata;

            let countryWasFounded = false;

            country.every( countryElement => {
                countryElement.names.forEach( countryName => {
                    if (countryName === invoiceCountry) {
                        if(countryElement.currency === invoiceCurrency && countryElement.currency === orderCurrency) {
                            countryWasFounded = true;
                            return false;
                        } else {
                            if(!countryElement.errorToIgnore.includes(ErrorTypes.CURENCYERROR)) { // if not ignore
                                countryWasFounded = true;
                                return false;
                            } else if(!countryElement.factureToIgnoreError.includes(invoiceObject.ID_ZRODLA.cdata)) {
                                throw new Error(`For invoice ${invoiceObject.ID_ZRODLA.cdata} true coutry curensy is ${countryElement.currency}. Real order curency is ${orderCurrency} nad real invoice curensy is ${invoiceCurrency}`)
                            } else countryWasFounded = true;
                        }
                    }
                })
                return true;
            })

            if (!countryWasFounded) {
                throw new Error(`Error! Can not found config for counry ${invoiceCountry} and currency ${invoiceCurrency}`)
            }
        }
    }
    catch(error: any) {
        console.log(error.message);
        throw new Error(error.message);
    }
}

async function updateInvoices(xmlObject: any, useNewVersion: boolean) {
    let responseData: GetInvoiceAccountantDataResponseBody = {};
    let invoices: any[] = [];

    if(Array.isArray(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT)) {
        if(useNewVersion) {
            responseData =  await (new BaselinkerDb().getInvoiceDataByInvoiceNumbers(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT.map((inv: any) => (inv.ID_ZRODLA.cdata as string))));
        }
        invoices.push(...(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT as Array<any>));
    } else {
        if(useNewVersion) {
            responseData =  await (new BaselinkerDb().getInvoiceDataByInvoiceNumbers([xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT.ID_ZRODLA.cdata]));
        }
        invoices.push(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT);
    }

    for(let invoiceObject of invoices) {
        try {
            await updateInvoice(invoiceObject, responseData, useNewVersion);
        } catch (e) {
            console.log(e);
            
        }
    }

}


async function updateInvoice(invoiceObject: any, attributesData: GetInvoiceAccountantDataResponseBody, useNewVersion: boolean) {
    await updateConversion(invoiceObject);
    updatePaymentType(invoiceObject);
    updatePaymentSection(invoiceObject);
    updateVatNumber(invoiceObject);
    updateVatCountry(invoiceObject);
    await updateInvoiceDates(invoiceObject);
    updatePrices(invoiceObject);
    updatePaymentCurrency(invoiceObject);
    
    if(useNewVersion) {
        await addAttributes(invoiceObject, attributesData);
    }

    checkInvoice(invoiceObject);

    updateFinishedJObject(invoiceObject);
}

async function addAttributes(invoiceObject: any, attributesData: GetInvoiceAccountantDataResponseBody) {
    const invoiceData = attributesData[invoiceObject.ID_ZRODLA.cdata];

    let sklOrdId = invoiceData && (isPrivateStore(invoiceData.orderSource, invoiceData.orderSourceId) ? invoiceData.extraFieldOne : invoiceData.storeOrderId);

    if(invoiceData) {
        const numZampSkl = isPrivateStore(invoiceData.orderSource, invoiceData.orderSourceId) ? invoiceData.extraFieldOne : invoiceData.storeOrderId;
        invoiceObject.ATRYBUTY = {
            ATRYBUT: [
              {
                KOD_ATR: {
                    cdata: 'NUMER ZAMOWIENIA SKL'
                },
                ID_ZRODLA_ATR: {
                    cdata: 'CED4DFCD-5CBC-4E9B-947E-4E2AFEE5D08E'
                },
                WARTOSC: {
                    cdata: numZampSkl == '0' ? '' : numZampSkl
                }
              },
              {
                KOD_ATR: {
                    cdata: 'NUMER ZAMOWIENIA BAS'
                },
                ID_ZRODLA_ATR: {
                    cdata: '9A998639-A814-452C-962E-9A28DD935417'
                },
                WARTOSC: {
                    cdata: invoiceData.baselinkerOrderId
                }
              },
              {
                KOD_ATR: {
                    cdata: 'LOGIN KLIENTA'
                },
                ID_ZRODLA_ATR: {
                    cdata: '59D8B122-AB51-4440-91F4-ED7A15C3FD57'
                },
                WARTOSC: {
                    cdata: invoiceData.userLogin
                }
              },
              {
                KOD_ATR: {
                    cdata: 'NUMER PRZESYLKI'
                },
                ID_ZRODLA_ATR: {
                    cdata: '3E7A89F5-1234-4CDE-9876-A1B2C3D4E5F6'
                },
                WARTOSC: {
                    cdata: invoiceData.deliveryPackage
                }
              }
            ]
        }
    } else {
        console.log(`Unable to find invoice data for invoice ${invoiceObject.ID_ZRODLA.cdata}`);
    }
    
}

function isPrivateStore(orderSource: string, orderSourceId: string) {
    const privateStoreIds = ['7408', '7517'];

    if(orderSource === 'personal' && privateStoreIds.includes(orderSourceId)) {
        return true;
    }

    return false;
}

async function getAttributesInvoiceDataByInvoiceNumber(invoiceNumber: string): Promise<InvoiceAccountantData | null> {
    const responseData =  await (new BaselinkerDb().getInvoiceDataByInvoiceNumbers([invoiceNumber]));
    
    if(responseData[invoiceNumber]) {
        return responseData[invoiceNumber];
    }

    return null;
}

function updatePaymentSection(invoiceObject: any) {
    if(invoiceObject.PLATNOSCI.PLATNOSC) {
        let paymentSection: any = invoiceObject.PLATNOSCI.PLATNOSC;
        if(invoiceObject.KRAJ.cdata === "Polska") {
            paymentSection.WALUTA_PLAT.cdata = "";
            paymentSection.KURS_WALUTY_PLAT.cdata = "";
        }
    }
}

async function updatePaymentCurrency(invoiceObject: any) {
    if(invoiceObject.PLATNOSCI.PLATNOSC) {
        if(invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT.cdata === "") {
            const countryObject = getCountryObjectIfName(invoiceObject.KRAJ.cdata);
            if(countryObject) {
                if(!countryObject.names.includes("Polska")) {
                    invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT.cdata = countryObject.currency;
                }
            }
        }
    }
}

async function updateConversion(invoiceObject: any, shouldChangeAnyway: boolean = false) {
    if(!invoiceObject.NOTOWANIE_WALUTY_ILE_2  || shouldChangeAnyway) {
        const lookingCountryObj = getCountryObjectIfName(invoiceObject.KRAJ.cdata);
        if(lookingCountryObj && !lookingCountryObj.names.includes("Polska")) {
            if(lookingCountryObj) {
                let posSum: any = {posSumBrutto: 0, posSumNetto: 0};
                const exchangeDate = createExchangeDate(invoiceObject.DATA_SPRZEDAZY.cdata);
                const midRate = await getMidRate(lookingCountryObj.convCurGetRequestWay, exchangeDate); //(await axios.get(`${lookingCountryObj.convCurGetRequestWay}/${invoiceObject.DATA_KURSU}`, {params: {format: "json"}})).data.rates[0].mid; 
                console.log(`The midrate of ${midRate.date} is ${midRate.rate}`);
                if(midRate.rate) {
                    if(invoiceObject.POZYCJE && invoiceObject.POZYCJE.POZYCJA) {
                        const positions = invoiceObject.POZYCJE.POZYCJA;
                        if(Array.isArray(positions)) {
                            for(let position of positions) {
                                updatePositionConvertion(position, midRate.rate, posSum);
                            }
                        } else {
                            updatePositionConvertion(positions, midRate.rate, posSum);
                        }
                    }
                    invoiceObject.NOTOWANIE_WALUTY_ILE_2 = addZeroToTheEnd(midRate.rate, 6);
                    invoiceObject.NOTOWANIE_WALUTY_ILE = addZeroToTheEnd(midRate.rate, 6);
                    invoiceObject.DATA_KURSU.cdata = midRate.date;
                    invoiceObject.DATA_KURSU_2.cdata = midRate.date;
                    if(invoiceObject.PLATNOSCI.PLATNOSC) {
                        invoiceObject.PLATNOSCI.PLATNOSC.NOTOWANIE_WALUTY_ILE_PLAT = addZeroToTheEnd(midRate.rate, 6);
                        invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT = parseFloat((midRate.rate * invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT).toFixed(2));
                        const difference = posSum.posSumBrutto + posSum.posSumNetto - invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT;
                        if(difference < 0.1) {
                            invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT = invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT + difference;
                        } else if(difference > 0.1) {
                            throw new Error(`Brutto positions summ is not equel to field PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT. Invoice ${invoiceObject.ID_ZRODLA.cdata}`)
                        }
                    }
                } else {
                    throw new Error(`Can not get conversion data for invoice ${invoiceObject.ID_ZRODLA.cdata}. Please try by your own.`);
                }
            } else {
                throw new Error(`Error! Please add ${invoiceObject.KRAJ.cdata} to config names`);
            }   
        }
    }
}

function updatePositionConvertion(position: any, rate: number, posSum: any) {
    position.NETTO_SYS = floatMultiply([position.NETTO, rate]);
    position.NETTO_SYS2 = position.NETTO_SYS;
    posSum.posSumNetto = floatSum([position.NETTO_SYS, posSum.posSumNetto]);
    position.VAT_SYS = floatMultiply([position.VAT, rate])
    position.VAT_SYS2 = position.VAT_SYS;
    posSum.posSumBrutto = floatSum([position.VAT_SYS, posSum.posSumBrutto])
}

function addZeroToTheEnd(value: string | number, maxLengthAfterDod: number): string {
    if(typeof value === 'number') {
        value = value.toString();
    }

    let delimeter = '';
    if(value.includes('.')) {
        delimeter = '.';
    } else if(value.includes(',')) {
        delimeter = ','
    }

    let valueArray: string[];

    if(delimeter) {
        valueArray = value.split(delimeter);
    } else {
        valueArray = [value, '']
    }

    valueArray[1] = valueArray[1].padEnd(maxLengthAfterDod, '0');

    return valueArray.join('.');
}

function createExchangeDate(sellDate: string): string { // exchange date = sell date - 1
    //2022-01-31
    let date = new Date(sellDate);
    date.setDate(date.getDate() - 1);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

async function getMidRate(adres: string, date: string): Promise<{rate: number , date: string}> {
    if(!adres) {
        throw new Error("Error! Please add convCurGetRequestWay par. data to this country.")
    }
    try {
        if(midRateTemporary[date] && midRateTemporary[date].available) {
            return {rate: midRateTemporary[date].rate, date: date}
        } else if(midRateTemporary[date] && midRateTemporary[date].available === false) {
            return await getMidRate(adres, DateTime.updateDate(date, {days: -1, mounth: 0, years: 0}))
        } else {
            let midRate = (await axios.get(`${adres}/${date}`, {params: {format: "json"}})).data.rates[0].mid;
            midRateTemporary[date] = {available: true, date: date, rate: midRate};
            return {date: date, rate: midRate};
        }
    } catch(error: any | undefined) {
        console.log(`Problem with adres ${adres}/${date}`);
        if(error?.response?.status === 429) {
            await (async function() {
                return new Promise((res, rej) => setTimeout(res, 2000))
            })()
            return await getMidRate(adres, date);
        }
        midRateTemporary[date] = {available: false, date: date, rate: 0}

        return await getMidRate(adres, DateTime.updateDate(date, {days: -1, mounth: 0, years: 0}));
    }
}

function updatePrices(invoiceObject: any) {
    const invoicePositions = invoiceObject.POZYCJE.POZYCJA;

    if(invoiceObject.KOREKTA === "Nie" && invoiceObject.PLATNOSCI) {
        if(Array.isArray(invoiceObject.POZYCJE.POZYCJA)) {
            let sumFromPos: number = 0;
            let sumFromInvoice = invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT;
            for(let pos of invoiceObject.POZYCJE.POZYCJA) {
                sumFromPos += pos.NETTO + pos.VAT;
            }

            if(sumFromPos !== sumFromInvoice) {
                const difference = +((sumFromInvoice - sumFromPos).toFixed(2));
                invoiceObject.POZYCJE.POZYCJA[0].NETTO = +((invoiceObject.POZYCJE.POZYCJA[0].NETTO + difference).toFixed(2));
            }
        }
    } else if(invoiceObject.KOREKTA === "Tak" && Array.isArray(invoicePositions)) {
        let difference = 0;
        (invoicePositions as Array<any>).forEach( position => difference += position.NETTO + position.VAT);
        if(difference > -1 && difference < 1) {
            invoicePositions[0].NETTO = +((invoicePositions[0].NETTO - difference)).toFixed(2);
        }
    }
}

async function updateInvoiceDates(invoiceObject: any) {
    if(invoiceObject.KOREKTA === "Nie") {
        if(invoiceObject.DATA_WYSTAWIENIA.cdata != invoiceObject.DATA_SPRZEDAZY.cdata) {
            const dateOfCreationArray: string[] = invoiceObject.DATA_WYSTAWIENIA.cdata.split("-");
            invoiceObject.DATA_SPRZEDAZY.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
            invoiceObject.TERMIN.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
            invoiceObject.DATA_KURSU.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
            invoiceObject.DATA_KURSU_2.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
            invoiceObject.DEKLARACJA_VAT7 = `${dateOfCreationArray[0]}-${dateOfCreationArray[1]}`;
            invoiceObject.DATA_DATAOBOWIAZKUPODATKOWEGO.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
            invoiceObject.DATA_DATAPRAWAODLICZENIA.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
            if(invoiceObject.PLATNOSCI) {
                invoiceObject.PLATNOSCI.PLATNOSC.TERMIN_PLAT.cdata = invoiceObject.DATA_WYSTAWIENIA.cdata;
                invoiceObject.PLATNOSCI.PLATNOSC.DATA_KURSU_PLAT.cdata = invoiceObject.DATA_KURSU.cdata;
            }
        }   
    }
}

function updatePaymentType(invoiceObject: any) {
    for(let countryConfig of country) {
        if(countryConfig.names.includes(invoiceObject.KRAJ.cdata)) {
            let paymentMethod: string | null = null;
            for(let countryPaymentMethod of countryConfig.paymentMethods) {
                if(checkIfContainText(countryPaymentMethod.keyWord, invoiceObject.FORMA_PLATNOSCI.cdata)) {
                    paymentMethod = countryPaymentMethod.changeTo;
                    break;
                }
            }

            if(paymentMethod === null) {
                throw new Error(`please add config for payment method ${invoiceObject.FORMA_PLATNOSCI.cdata} for country ${countryConfig.shortName}. Invoice id - ${invoiceObject.ID_ZRODLA.cdata}. Invoice name - ${invoiceObject.NAZWA1.cdata}`)
            }

            invoiceObject.FORMA_PLATNOSCI.cdata = paymentMethod;
            if(invoiceObject.PLATNOSCI.PLATNOSC) {
                invoiceObject.PLATNOSCI.PLATNOSC.FORMA_PLATNOSCI_PLAT.cdata = paymentMethod;
            }
            break;
        }
    }

}

function updateVatCountry(invoiceObject: any) {
    if(!invoiceObject.NIP_KRAJ.cdata) {
        for(const countryElement of country) {
            for(let countryName of countryElement.names) {
                if(countryName === invoiceObject.KRAJ.cdata) {
                    invoiceObject.NIP_KRAJ.cdata = countryElement.shortName;
                    return;
                }
            }
        }

        if(!invoiceObject.KRAJ.cdata) {
            throw new Error(`Invoice with number ${invoiceObject.ID_ZRODLA.cdata} does not contain invoice country`);
        } else {
            throw new Error(`Can not find country of invoice with number ${invoiceObject.ID_ZRODLA.cdata} inside country config. Please add ${invoiceObject.KRAJ.cdata} to config.`);
        }
    }
}

function updateVatNumber(invoiceObject: any) {
    if(!invoiceObject.NIP.cdata) {
        invoiceObject.NIP.cdata = "0000000000";
    }
}

function updateFinishedJObject(invoiceObject: any) {
    // remove baselinker update
    if(invoiceObject.NR_KSEF?.cdata !== undefined)  invoiceObject.NR_KSEF = invoiceObject.NR_KSEF.cdata;
    if(invoiceObject.DODATKOWY_OPIS?.cdata  !== undefined) invoiceObject.DODATKOWY_OPIS = invoiceObject.DODATKOWY_OPIS.cdata;
}

function replaceData(data: string, dataToReplace: KeyAndValue[]) {
    for(const replace of dataToReplace) {
        data = data.replace(new RegExp(replace.key, "g"), replace.value);
    }

    return data;
}

function addCdata(jXmlObject: any, rules: string[]) { // change values to CDATA by config cdataRows
    for(const [key, value] of Object.entries(jXmlObject)) {
        if(typeof jXmlObject[key] !== "object") {
            if(rules.includes(key)) {
                jXmlObject[key] = `<![CDATA[${value}]]>`;
            }
        } else if (typeof jXmlObject[key] === "object") {
            addCdata(jXmlObject[key], rules);
        }
    }
}