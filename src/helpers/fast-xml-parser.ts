import { X2jOptions, XMLBuilder, XmlBuilderOptions, XMLParser } from "fast-xml-parser";
import cDataRows from "../config/c-data-rows";
import country, {ifContainCountryName, getCountryObjectIfName} from "../config/config";
import {checkVAT} from 'jsvat'
import axios from "axios";
import DateTime from "../utils/DateTime";

interface KeyAndValue {
    key: string,
    value: string
}

export async function resolveSalesRaport(xmlStringata: string): Promise<string> {
    const xmlParseOption: Partial<X2jOptions> = {
        ignoreAttributes: false,
        parseAttributeValue: false,
        allowBooleanAttributes: true, // atributes without value,
        unpairedTags: ["ATRYBUTY"]
    }
    const xmlBuilderOption: Partial<XmlBuilderOptions> = {
        format: true,
        ignoreAttributes: false,
        unpairedTags: ["ATRYBUTY", "KWOTY_DODATKOWE"],
        suppressUnpairedNode: false
    }

    const xmlObject: any = new XMLParser(xmlParseOption).parse(xmlStringata);
    
    await updateInvoices(xmlObject); // here is the problem need to resolve async
    
    let xmlResult = new XMLBuilder(xmlBuilderOption).build(xmlObject);
    
    xmlResult = replaceData(
        xmlResult,
        [
            {
                key: "&lt;",
                value: "<"
            }, 
            {
                key: "&gt;",
                value: ">"
            }
        ]
    )

    return xmlResult;
}

function checkVatNumber(invoiceObject: any) {
    const pozycje = invoiceObject.POZYCJE;
    if(invoiceObject.KRAJ !== "Polska" && invoiceObject.NIP !== "0000000000" && invoiceObject.NIP !== "") {
        let countryWasFounded = false;
        for(let countryElement of country) {
            countryElement.names.forEach( countryName => {
                if(countryName === invoiceObject.KRAJ) {
                    if(pozycje.POZYCJA) { // optimise
                        let vatCheckResult = checkVAT(`${countryElement.shortName}${invoiceObject.NIP}`, [countryElement.viesConfig])
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
            throw new Error(`Error! Please check country configuration in config file. Invoice ${invoiceObject.ID_ZRODLA} with country ${invoiceObject.KRAJ}`);
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
            let invoiceCurrency = invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT;
            let orderCurrency = invoiceObject.WALUTA;
            let invoiceCountry = invoiceObject.KRAJ;

            let countryWasFounded = false;

            country.every( countryElement => {
                countryElement.names.forEach( countryName => {
                    if (countryName === invoiceCountry) {
                        if(countryElement.currency === invoiceCurrency && countryElement.currency === orderCurrency) {
                            countryWasFounded = true;
                            return false;
                        } else {
                            for(let countryName of countryElement.names) {
                                if(countryName === "Czechy") {
                                    countryWasFounded = true;
                                    return false;
                                }
                            }
                            throw new Error(`For invoice ${invoiceObject.ID_ZRODLA} true coutry curensy is ${countryElement.currency}. Real order curency is ${orderCurrency} nad real invoice curensy is ${invoiceCurrency}`)
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

async function updateInvoices(xmlObject: any) {

    if(Array.isArray(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT)) {
        for(let invoiceObject of (xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT as Array<any>)) {
            await updateInvoice(invoiceObject);
        }
    } else {
        let invoiceObject = xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT;
        await updateInvoice(invoiceObject);
    }
}


async function updateInvoice(invoiceObject: any) {
    await updateConversion(invoiceObject);
    updatePaymentType(invoiceObject);
    updateVatNumber(invoiceObject);
    updateVatCountry(invoiceObject);
    await updateInvoiceDates(invoiceObject);
    updatePrices(invoiceObject);
    updatePaymentCurrency(invoiceObject);

    checkInvoice(invoiceObject);

    updateFinishedJObject(invoiceObject);
}

async function updatePaymentCurrency(invoiceObject: any) {
    if(invoiceObject.PLATNOSCI.PLATNOSC) {
        if(invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT === "") {
            const countryObject = getCountryObjectIfName(invoiceObject.KRAJ);
            if(countryObject) {
                invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT = countryObject.currency;
            }
        }
    }
}

async function updateConversion(invoiceObject: any, shouldChangeAnyway: boolean = false) {
    if(invoiceObject.NOTOWANIE_WALUTY_ILE_2 === 0  || shouldChangeAnyway) {
        const lookingCountryObj = getCountryObjectIfName(invoiceObject.KRAJ);
        if(lookingCountryObj && !lookingCountryObj.names.includes("Polska")) {
            if(lookingCountryObj) {
                const midRate = await getMidRate(lookingCountryObj.convCurGetRequestWay, invoiceObject.DATA_KURSU); //(await axios.get(`${lookingCountryObj.convCurGetRequestWay}/${invoiceObject.DATA_KURSU}`, {params: {format: "json"}})).data.rates[0].mid; 
                console.log(`The midrate of ${invoiceObject.DATA_KURSU} is ${midRate}`);
                if(midRate) {
                    invoiceObject.NOTOWANIE_WALUTY_ILE_2 = midRate;
                    invoiceObject.NOTOWANIE_WALUTY_ILE = midRate;
                    if(invoiceObject.PLATNOSCI.PLATNOSC) {
                        invoiceObject.PLATNOSCI.PLATNOSC.NOTOWANIE_WALUTY_ILE_PLAT = midRate;
                        invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLN_PLAT = parseFloat((midRate * invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT).toFixed(2));
                    }
                } else {
                    throw new Error(`Can not get conversion data for invoice ${invoiceObject.ID_ZRODLA}. Please try by your own.`);
                }
            } else {
                throw new Error(`Error! Please add ${invoiceObject.KRAJ} to config names`);
            }   
        }
    }
}
//NOTOWANIE_WALUTY_ILE_2 - mid rate
//PLATNOSCI -> PLATNOSC -> NOTOWANIE_WALUTY_ILE_PLAT - mid rate
//PLATNOSCI -> PLATNOSC -> KWOTA_PLN_PLAT - (PLATNOSCI -> PLATNOSC -> NOTOWANIE_WALUTY_ILE_PLAT) * (PLATNOSCI -> PLATNOSC -> KWOTA_PLAT)

async function getMidRate(adres: string, date: string): Promise<number> {
    if(!adres) {
        throw new Error("Error! Please add convCurGetRequestWay par. data to this country.")
    }
    try {
        const midRate = (await axios.get(`${adres}/${date}`, {params: {format: "json"}})).data.rates[0].mid;
        return midRate;
    } catch(error: any | undefined) {
        console.log(`Problem with adres ${adres}/${date}`);
        if(error?.response?.status === 429) {
            await (async function() {
                return new Promise((res, rej) => setTimeout(res, 2000))
            })()
            return getMidRate(adres, date);
        }
        return getMidRate(adres, DateTime.updateDate(date, {days: -1, mounth: 0, years: 0}));
    }
}

function updatePrices(invoiceObject: any) {
    const invoicePositions = invoiceObject.POZYCJE.POZYCJA;

    if(invoiceObject.KOREKTA === "Nie") {
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
        if(invoiceObject.DATA_WYSTAWIENIA != invoiceObject.DATA_SPRZEDAZY) {
            const dateOfCreationArray: string[] = invoiceObject.DATA_WYSTAWIENIA.split("-");
            invoiceObject.DATA_SPRZEDAZY = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.TERMIN = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.DATA_KURSU = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.DATA_KURSU_2 = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.DEKLARACJA_VAT7 = `${dateOfCreationArray[0]}-${dateOfCreationArray[1]}`;
            invoiceObject.DATA_DATAOBOWIAZKUPODATKOWEGO = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.DATA_DATAPRAWAODLICZENIA = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.PLATNOSCI.PLATNOSC.TERMIN_PLAT = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.PLATNOSCI.PLATNOSC.DATA_KURSU_PLAT = invoiceObject.DATA_KURSU;
            await updateConversion(invoiceObject, true);
        }   
    }
}

function updatePaymentType(invoiceObject: any) {
    invoiceObject.FORMA_PLATNOSCI = "Przelew";
    invoiceObject.PLATNOSCI.PLATNOSC.FORMA_PLATNOSCI_PLAT = "Przelew";
}

function updateVatCountry(invoiceObject: any) {
    if(!invoiceObject.NIP_KRAJ) {
        for(const countryElement of country) {
            for(let countryName of countryElement.names) {
                if(countryName === invoiceObject.KRAJ) {
                    invoiceObject.NIP_KRAJ = countryElement.shortName;
                    return;
                }
            }
        }

        if(!invoiceObject.KRAJ) {
            throw new Error(`Invoice with number ${invoiceObject.ID_ZRODLA} does not contain invoice country`);
        } else {
            throw new Error(`Can not find country of invoice with number ${invoiceObject.ID_ZRODLA} inside country config. Please add ${invoiceObject.KRAJ} to config.`);
        }
    }
}

function updateVatNumber(invoiceObject: any) {
    if(!invoiceObject.NIP) {
        invoiceObject.NIP = "0000000000";
    }
}

function updateFinishedJObject(invoiceObject: any) {
    addCdata(invoiceObject);
}

function replaceData(data: string, dataToReplace: KeyAndValue[]) {
    for(const replace of dataToReplace) {
        data = data.replace(new RegExp(replace.key, "g"), replace.value);
    }

    return data;
}

function addCdata(jXmlObject: any) { // change values to CDATA by config cdataRows
    for(const [key, value] of Object.entries(jXmlObject)) {
        if(typeof jXmlObject[key] !== "object") {
            if(cDataRows.includes(key)) {
                jXmlObject[key] = `<![CDATA[${value}]]>`;
            }
        } else if (typeof jXmlObject[key] === "object") {
            addCdata(jXmlObject[key]);
        }
    }
}