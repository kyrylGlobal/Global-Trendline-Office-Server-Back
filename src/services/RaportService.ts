import { UploadedFile } from "express-fileupload";
import { SalesRaportFileDateInfo } from "../interfaces/Files";
import xml2js, { Builder } from 'xml2js';
import StringUpdateOption from "../interfaces/StringUpdateOption";

class RaportService{
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
        console.log();
        
    }

    generateXmlResultFileData(raportFile: UploadedFile): string{
        
        this.#checkFileExtention(raportFile.mimetype);

        const fileDataXml = this.getDataString(raportFile);

        const jsObject: SalesRaportFileDateInfo = {
            data: fileDataXml,
            originFileName: this.getFileName(raportFile)
        }

        this.updateXMLString(jsObject);

        this.checkFinalResult(jsObject);

        return jsObject.data;
    }

    private checkFinalResult(jsObject: SalesRaportFileDateInfo){
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

    #checkFileExtention(extention: string){
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