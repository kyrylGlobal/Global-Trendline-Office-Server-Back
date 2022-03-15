import { UploadedFile } from "express-fileupload";
import { SalesRaportFileDateInfo } from "../interfaces/Files";
import xml2js, { Builder } from 'xml2js';
import StringUpdateOption from "../interfaces/StringUpdateOption";
import { PositionRaportData, SalesRaportData } from "../interfaces/SalesRaportData";
import { getData, getDataArray } from "../utils/regex-helper";
import { country, Country } from "../data/country";

class RaportService{

    generateXmlResultFileData(raportFile: UploadedFile): string{
        
        this.checkFileExtention(raportFile.mimetype);

        const fileDataXml = this.getDataString(raportFile);

        const jsObject: SalesRaportFileDateInfo = {
            data: fileDataXml,
            originFileName: this.getFileName(raportFile)
        }

        this.checkXmlSumm(jsObject);

        this.updateXMLString(jsObject);

        this.checkFinalResult(jsObject);

        return jsObject.data;
    }

    getDataString(file: UploadedFile | UploadedFile[]): string {
        if(Array.isArray(file)){
            throw new Error("Can not work with array right now.");
        }
        else{
            const fileString: string = file.data.toString('utf-8');

            return fileString;
        }
    }

    getFileName(file: UploadedFile): string{
        return file.name;
    }

    convertJsObjectToXml(dataJs: Object): string {return new Builder().buildObject(dataJs)};

    convertXmlToJsObject(dataXml: string): Object{
        let result = {};
        xml2js.parseString(dataXml, (error, xmlObject: Object ) => {
            if(error){
                throw new Error("Error with parsing string to json.")
            }
            else{
                result = xmlObject;
            }
        });

        return result;
    }

    private updateXMLString(jsObject: SalesRaportFileDateInfo): void {
        const przelew: string = "Przelew";
        const pobranie: string = "Pobranie";
        const changeToPobranie = ['Za pobraniem', 'Plata ramburs', 'za pobraniem', ''];
        const changeToPrzelew = ['', 'Carte de credit', " zwrot za pobranie - DUONET 03.11.2021"];
        const updaterOptions: StringUpdateOption[] = [
            {
                from: ['<NIP><!\\[CDATA\\[\\]\\]><\/NIP>'],
                to: '<NIP><![CDATA[0000000000]]></NIP>'
            },
            {
                from: (function (): string[] {
                    let przelewCases: string[] = [];
                    changeToPrzelew.forEach( option => {
                        przelewCases.push(`<FORMA_PLATNOSCI><!\\[CDATA\\[${option}\\]\\]><\\/FORMA_PLATNOSCI>`);
                    })

                    return przelewCases;
                })(),
                to: `<FORMA_PLATNOSCI><![CDATA[${przelew}]]></FORMA_PLATNOSCI>`
            },
            {
                from: (function (): string[] {
                    let pobranieCases: string[] = [];
                    changeToPobranie.forEach( option => {
                        pobranieCases.push(`<FORMA_PLATNOSCI><!\\[CDATA\\[${option}\\]\\]><\\/FORMA_PLATNOSCI>`);
                    })

                    return pobranieCases;
                })(),
                to: `<FORMA_PLATNOSCI><![CDATA[${pobranie}]]></FORMA_PLATNOSCI>`
            }
        ]

        updaterOptions.forEach( option => {
            option.from.forEach( from => {
                let regex = new RegExp(from, 'g');
                let a = jsObject.data.search(regex);
                jsObject.data = jsObject.data.replace(new RegExp(from, 'g'), option.to);
            })
        })
    }

    private checkXmlSumm(jsObject: SalesRaportFileDateInfo) {
        const regexForGettingSalesInvoices = /<REJESTR_SPRZEDAZY_VAT>[\s\S]*?<\/REJESTR_SPRZEDAZY_VAT>/g;
        let invoicesObjects: SalesRaportData[] = this.getXmlRaportSalesData(regexForGettingSalesInvoices, jsObject);

        this.updateRaportsSumm(invoicesObjects);
        this.updateRaportsCorrectionSumm(invoicesObjects);
        this.updateVatCountry(invoicesObjects);

        this.updateInvoicesObject(jsObject, invoicesObjects);
    }

    private updateVatCountry(invoicesObjects: SalesRaportData[]) {
        invoicesObjects.forEach( invoice => {
            const countryName: string = this.getCurrentInvoiceCountry(invoice);
            let countryWasFound: boolean = false;
            country.every( countryElement => {
                if(countryElement.name === countryName) {
                    countryWasFound = true;
                    this.updateInvoiceCountryString(invoice, countryElement);
                    
                    return false;
                }
                return true;
            })

            if(!countryWasFound) {
                throw new Error(`${countryName} was not regestrated as looking country. Please update "country" data.`)
            }
        })
    }

    private updateInvoiceCountryString(invoiceObject: SalesRaportData, country: Country) {
        if(invoiceObject.newContent) {
            invoiceObject.newContent = invoiceObject.newContent.replace(
                `<NIP_KRAJ><![CDATA[]]></NIP_KRAJ>`,
                `<NIP_KRAJ><![CDATA[${country.shortName}]]></NIP_KRAJ>`
            )
        } else {
            invoiceObject.newContent = invoiceObject.baseContent.replace(
                `<NIP_KRAJ><![CDATA[]]></NIP_KRAJ>`,
                `<NIP_KRAJ><![CDATA[${country.shortName}]]></NIP_KRAJ>`
            )
        }
    }

    private getCurrentInvoiceCountry(invoiceObject: SalesRaportData): string {
        const getCountryRegex: RegExp = /<KRAJ><!\[CDATA\[([AaĄąBbCcĆćDdEeĘęFfGgHhIiJjKkLlŁłMmNnŃńOoÓóPpRrSsŚśTtUuWwYyZzŹźŻż]+)]]><\/KRAJ>/;
        const regexResult: RegExpExecArray | null = getCountryRegex.exec(invoiceObject.baseContent);
        if(regexResult && regexResult[1]) {
            return regexResult[1];
        } else {
            return "Polska";
        }
    }

    private updateRaportsCorrectionSumm(invoicesObjects: SalesRaportData[]): void {
        invoicesObjects.forEach( invoiceObject => {
            const isCorrectionString = "<KOREKTA>Tak</KOREKTA>";
            const isPostionsChangingString = "<POZYCJA>";
            if(invoiceObject.baseContent.includes(isCorrectionString) && invoiceObject.baseContent.includes(isPostionsChangingString)) {
                const positionsRaportData: PositionRaportData[] = this.getSalesRaportInvoicePositions(invoiceObject);
                const fullSummByPositions: number = this.getFullSummByPositions(invoiceObject);

                if(fullSummByPositions != 0) {
                    this.updatePositionsSumm(positionsRaportData);
                    this.updateSalesRaportData(invoiceObject, positionsRaportData)
                }
            }
        });
    }

    private updatePositionsSumm(positionRaportData: PositionRaportData[]) {
        const basePositions: PositionRaportData[] = positionRaportData.slice(0, positionRaportData.length / 2);
        const correctPositions: PositionRaportData[] = positionRaportData.slice(positionRaportData.length / 2, positionRaportData.length);

        if(basePositions.length === correctPositions.length) {
            for(let i = 0; i < basePositions.length; i++) {
                const difference: number = parseFloat(Math.abs(basePositions[i].fullSumm + correctPositions[i].fullSumm).toFixed(2));
                const curCorrectionIndex: number = positionRaportData.length / 2 + i;
                const newNettoSumm: number =  parseFloat((correctPositions[i].netto + difference).toFixed(2));
                if(difference != 0) {
                    positionRaportData[curCorrectionIndex].newContent = positionRaportData[curCorrectionIndex].baseContent.replace(`<NETTO>${correctPositions[i].netto}</NETTO>`, `<NETTO>${newNettoSumm}</NETTO>`) // to do not full summ but summ of netto
                }
            }
        }
    }

    private getSalesRaportInvoicePositions(invoiceObj: SalesRaportData): PositionRaportData[] {
        const invoicePositionsArray: PositionRaportData[] = [];
        const regexPosition = /<POZYCJA>[\s\S]*?<\/POZYCJA>/g;

        let regexResult: RegExpExecArray | null;

        while(regexResult = regexPosition.exec(invoiceObj.baseContent)) {
            if(regexResult && regexResult[0]) {
                invoicePositionsArray.push( {
                    baseContent: regexResult[0],
                    fullSumm: this.getPositionFullSumm(regexResult[0]),
                    netto: parseFloat(getData(/<NETTO>([\s\S]*?)<\/NETTO>/, regexResult[0]))
                });
            }
        }

        return invoicePositionsArray;
    }

    private getPositionFullSumm(positionData: string): number {
        const regexPositions: RegExp[] = [
            /<NETTO>([\s\S]*?)<\/NETTO>/,
            /<VAT>([\s\S]*?)<\/VAT>/
        ];
        let result: number = 0;

        regexPositions.forEach( regexPosition => {
            result += parseFloat(getData(regexPosition, positionData));
        })

        return result;

    }

    private updateInvoicesObject(jsObject: SalesRaportFileDateInfo, invoicesObjects: SalesRaportData[]) {
        invoicesObjects.forEach( invoiceObject => {
            if(invoiceObject.newContent) {
                jsObject.data = jsObject.data.replace(invoiceObject.baseContent, invoiceObject.newContent);
            }
        })
    }

    private updateSalesRaportData(base: SalesRaportData, parts: SalesRaportData[]) {
        parts.forEach( part => {
            if(base.newContent && part.newContent) {
                base.newContent = base.newContent.replace(part.baseContent, part.newContent);
            } else if(!base.newContent && part.newContent) {
                base.newContent = base.baseContent.replace(part.baseContent, part.newContent);
            }
        });
    }

    private updateRaportsSumm(invoicesObjects: SalesRaportData[]) {
        invoicesObjects.forEach( invoiceObj => {
            let baseFullSymm: number | undefined = this.getFullSumOfInvoice(invoiceObj);
            const fullSummByPositions: number = parseFloat(this.getFullSummByPositions(invoiceObj).toFixed(2));

            if(baseFullSymm  && fullSummByPositions &&  Math.abs(baseFullSymm) != Math.abs(fullSummByPositions)) {
                const from = `<KWOTA_PLAT>${baseFullSymm.toFixed(2)}</KWOTA_PLAT>`;
                const to = `<KWOTA_PLAT>${fullSummByPositions.toString()}</KWOTA_PLAT>`;
                invoiceObj.newContent = invoiceObj.baseContent.replace(from, to);
            }
        })
    }

    private getFullSummByPositions(invoicesObject: SalesRaportData): number {
        let fullPosSumm: number = 0;
        const regexPositions: RegExp[] = [
            /<NETTO>([\s\S]*?)<\/NETTO>/g,
            /<VAT>([\s\S]*?)<\/VAT>/g
        ];

        regexPositions.forEach( regex => {
            const arrayOfStringNumbers: string[] = getDataArray(regex, invoicesObject.baseContent);
            arrayOfStringNumbers.forEach( stringNumber => {
                fullPosSumm += parseFloat(stringNumber);
            });
        });

        return fullPosSumm;
    }

    private getFullSumOfInvoice(invoiceObj: SalesRaportData): number | undefined {
        let fullSumInvoice: number;
        const regexFullSum = /<KWOTA_PLAT>([\s\S]*?)<\/KWOTA_PLAT>/;
        const regexResult: RegExpExecArray | null = regexFullSum.exec(invoiceObj.baseContent);

        if(regexResult && regexResult[1]){
            fullSumInvoice = parseFloat(regexResult[1]);
            return fullSumInvoice;
        } // else {
        //     throw new Error("No data incide <KWOTA_PLAT>. Need it to check summ proper. ");
        // }
    }

    private getXmlRaportSalesData(regex: RegExp, jsObject?: SalesRaportFileDateInfo, salesRaportData?: SalesRaportData): SalesRaportData[] {
        let dataObjects: SalesRaportData[] = [];

        let regexResult: RegExpExecArray | null;

        let data = "";

        if(jsObject) {
            data = jsObject.data;
        } else if(salesRaportData) {
            data = salesRaportData.baseContent;
        }

        while( regexResult = regex.exec(data)) {
            if(regexResult[0]) {
                dataObjects.push({
                    baseContent: regexResult[0]
                });
            }
        }

        return dataObjects;
    }

    private checkFinalResult(jsObject: SalesRaportFileDateInfo) {
        this.checkVatNumber(jsObject);
        this.checkPaymentType(jsObject);
    }

    private checkPaymentType(jsObject: SalesRaportFileDateInfo){
        const vatNumberRegex = /<FORMA_PLATNOSCI><!\[CDATA\[(.*)\]\]><\/FORMA_PLATNOSCI>/g;

        const lookingStrings: string[] = ['Przelew', 'Pobranie'];

        let regexResult: RegExpExecArray | null;
        while(regexResult = vatNumberRegex.exec(jsObject.data)){
            if(regexResult && !lookingStrings.includes(regexResult[1])){
                throw new Error(`Please specify payment method types. Problem with FORMA_PLATNOŚCI. Problem string is [${regexResult[1]}]`);
            }
        }
        
    }

    private checkVatNumber(jsObject: SalesRaportFileDateInfo){
        const vatNumberRegex = /<NIP><!\[CDATA\[]]><\/NIP>/;

        if(jsObject.data.search(vatNumberRegex) > 0){
            throw new Error(`Please replace all NIP fild wihite spaces with 0000000000`);
        }
    }

    private checkFileExtention(extention: string){
        const availableExtentions: string[] = ["text/xml"];
        
        if(availableExtentions.includes(extention)){
            return true;
        }
        else{
            throw new Error(`Can not read file extention -> ${extention}`);
        }
    }
}

export default new RaportService;