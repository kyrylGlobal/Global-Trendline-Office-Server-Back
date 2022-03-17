import { X2jOptions, XMLBuilder, XmlBuilderOptions, XMLParser } from "fast-xml-parser";
import cDataRows from "../config/c-data-rows";
import country from "../config/country";

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

function updateInvoices(xmlObject: any) {

    if(Array.isArray(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT)) {
        (xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT as Array<any>).forEach( invoiceObject => {
            updateInvoice(invoiceObject);
        })
    } else {
        updateInvoice(xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT.REJESTR_SPRZEDAZY_VAT);
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
    if(invoiceObject.KOREKTA === "Nie") {
        let sumFromPos: number = 0;
        let sumFromInvoice = invoiceObject.PLATNOSCI.PLATNOSC.KWOTA_PLAT;
        for(let pos of invoiceObject.POZYCJE.POZYCJA) {
            sumFromPos += pos.NETTO + pos.VAT;
        }

        if(sumFromPos !== sumFromInvoice) {
            const difference = +((sumFromInvoice - sumFromPos).toFixed(2));
            console.log(difference);
            invoiceObject.POZYCJE.POZYCJA[0].NETTO += difference;
        } 
    } else {

    }
}

function updateInvoiceDates(invoiceObject: any) {
    if(invoiceObject.DATA_WYSTAWIENIA != invoiceObject.DATA_SPRZEDAZY) {
        invoiceObject.DATA_SPRZEDAZY = invoiceObject.DATA_WYSTAWIENIA;
        invoiceObject.TERMIN = invoiceObject.DATA_WYSTAWIENIA;
        invoiceObject.DATA_DATAOBOWIAZKUPODATKOWEGO = invoiceObject.DATA_WYSTAWIENIA;
        invoiceObject.DATA_DATAPRAWAODLICZENIA = invoiceObject.DATA_WYSTAWIENIA;
        invoiceObject.PLATNOSCI.PLATNOSC.TERMIN_PLAT = invoiceObject.DATA_WYSTAWIENIA;
        invoiceObject.PLATNOSCI.PLATNOSC.DATA_KURSU_PLAT = invoiceObject.DATA_KURSU;
    }
}

function updatePaymentType(invoiceObject: any) {
    invoiceObject.FORMA_PLATNOSCI = "Przelew";
}

function updateVatCountry(invoiceObject: any) {
    if(!invoiceObject.NIP_KRAJ) {
        for(const countryElement of country) {
            if(countryElement.name === invoiceObject.KRAJ) {
                invoiceObject.NIP_KRAJ = countryElement.shortName;
                return;
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
