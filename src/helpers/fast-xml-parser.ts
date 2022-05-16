import { X2jOptions, XMLBuilder, XmlBuilderOptions, XMLParser } from "fast-xml-parser";
import cDataRows from "../config/c-data-rows";
import country from "../config/config";
import {checkVAT} from 'jsvat'

interface KeyAndValue {
    key: string,
    value: string
}

export function resolveSalesRaport(xmlStringata: string): string {
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
    
    updateInvoices(xmlObject);
    
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
        let invoiceCurrency = invoiceObject.PLATNOSCI.PLATNOSC.WALUTA_PLAT;
        let invoiceCountry = invoiceObject.KRAJ;

        let countryWasFounded = false;

        country.every( countryElement => {
            countryElement.names.forEach( countryName => {
                if (countryName === invoiceCountry) {
                    if( countryElement.currency === invoiceCurrency) {
                        countryWasFounded = true;
                        return false;
                    } else {
                        throw new Error(`Error! Facture ${invoiceObject.ID_ZRODLA} contain country ${invoiceCountry} with ${invoiceCurrency}`)
                    }
                }
            })
            return true;
        })

        if (!countryWasFounded) {
            throw new Error(`Error! Can not found config for counry ${invoiceCountry} and currency ${invoiceCurrency}`)
        }
    }
    catch(error: any) {
        console.log(error)
    }
}

function updateInvoices(xmlObject: any) {

    if(Array.isArray(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT)) {
        (xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT as Array<any>).forEach( invoiceObject => {
            checkInvoice(invoiceObject);
            updateInvoice(invoiceObject);

        })
    } else {
        let invoiceObject = xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT;
        checkInvoice(invoiceObject)
        updateInvoice(invoiceObject);
    }
}


function updateInvoice(invoiceObject: any) {
    updatePaymentType(invoiceObject);
    updateVatNumber(invoiceObject);
    updateVatCountry(invoiceObject);
    updateInvoiceDates(invoiceObject);
    updatePrices(invoiceObject);

    updateFinishedJObject(invoiceObject);
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
        if(invoiceObject.ID_ZRODLA === "49/11/2021/K/RO") {
            console.log();
        }
        if(difference > -1 && difference < 1) {
            invoicePositions[0].NETTO = +((invoicePositions[0].NETTO - difference)).toFixed(2);
        }
    }
}

function updateInvoiceDates(invoiceObject: any) {
    if(invoiceObject.KOREKTA === "Nie") {
        if(invoiceObject.DATA_WYSTAWIENIA != invoiceObject.DATA_SPRZEDAZY) {
            invoiceObject.DATA_SPRZEDAZY = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.TERMIN = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.DATA_DATAOBOWIAZKUPODATKOWEGO = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.DATA_DATAPRAWAODLICZENIA = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.PLATNOSCI.PLATNOSC.TERMIN_PLAT = invoiceObject.DATA_WYSTAWIENIA;
            invoiceObject.PLATNOSCI.PLATNOSC.DATA_KURSU_PLAT = invoiceObject.DATA_KURSU;
        }   
    }
}

function updatePaymentType(invoiceObject: any) {
    invoiceObject.FORMA_PLATNOSCI = "Przelew";
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
