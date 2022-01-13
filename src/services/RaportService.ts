import { UploadedFile } from "express-fileupload";
import { SalesRaportFileDateInfo } from "../interfaces/Files";
import xml2js, { Builder } from 'xml2js';

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
        xml2js.parseString(dataXml, (error, xmlObject: Object) => {
            if(error){
                throw new Error("Error with parsing string to json.")
            }
            else{
                result = xmlObject;
            }
        });

        return result;
    }

    updateXmlObject(xmlObject: Object | any){
        let REJESTR_SPRZEDAZY_VAT: any[] = xmlObject.ROOT.REJESTRY_SPRZEDAZY_VAT[0].REJESTR_SPRZEDAZY_VAT; // this variable is a array of objects with sales
        REJESTR_SPRZEDAZY_VAT.forEach( sale => {
            sale.FORMA_PLATNOSCI = this.#updateXmlPositionFormaPlat(sale.FORMA_PLATNOSCI);
            sale.NIP_KRAJ = this.#updateXmlPositionNip(sale.NIP_KRAJ);
            sale.NIP = this.#updateXmlPositionNip(sale.NIP);
        });
    }

    generateXmlResultFileData(raportFile: UploadedFile): string{
        
        this.#checkFileExtention(raportFile.mimetype);

        const fileDataXml = this.getDataString(raportFile);

        const jsObject: SalesRaportFileDateInfo = {
            data: this.convertXmlToJsObject(fileDataXml),
            originFileName: this.getFileName(raportFile)
        }

        this.updateXmlObject(jsObject.data);

        return this.convertJsObjectToXml(jsObject.data);
    }

    #updateXmlPositionNip(xmlPos: Object): Object{
        const defaultVat = "0000000000";
        const xmlPosString = xmlPos.toString();
        
        if(xmlPosString === ''){
            return [defaultVat];
        }
        else{
            return xmlPos;
        }

    }

    #updateXmlPositionFormaPlat(xmlPos: Object): Object{
        const xmlPosString: string = xmlPos.toString();
        const przelew: string = "Przelew";
        const pobranie: string = "Pobranie";
        const changeToPobranie = ['Za pobraniem', 'Plata ramburs'];
        const changeToPrzelew = ['', 'Carte de credit'];

        if(xmlPosString === przelew || xmlPosString === pobranie)
        {
            return xmlPos;
        }
        else if(changeToPrzelew.includes(xmlPosString)){
            return [przelew];
        }
        else if(changeToPobranie.includes(xmlPosString)){
            return [pobranie];
        }
        else{
            throw new Error(`Do not undertand FORMA_PLATNOSCI position with value ${xmlPosString}`);
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