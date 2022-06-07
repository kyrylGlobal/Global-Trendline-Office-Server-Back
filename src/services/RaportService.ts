import { UploadedFile } from "express-fileupload";
import { SalesRaportFileDateInfo } from "../interfaces/Files";
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import Files from "../utils/Files";
import { resolveSalesRaport } from "../helpers/fast-xml-parser";

class RaportService{

    async generateXmlResultFileData(raportFile: UploadedFile): Promise<string> {
        
        this.checkFileExtention(raportFile.mimetype);

        const fileDataXml = this.getDataString(raportFile);

        const xmlResult = await resolveSalesRaport(fileDataXml);

        return xmlResult;
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