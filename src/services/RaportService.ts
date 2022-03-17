import { UploadedFile } from "express-fileupload";
import { SalesRaportFileDateInfo } from "../interfaces/Files";
import { XMLParser, XMLBuilder, XMLValidator} from 'fast-xml-parser';
import Files from "../utils/Files";

class RaportService{

    generateXmlResultFileData(raportFile: UploadedFile): string {
        
        this.checkFileExtention(raportFile.mimetype);

        // const fileDataXml = this.getDataString(raportFile);
        const fileDataXml = Files.readFileSync("../../public/testFIles/at_test.xml");
        console.log

        const xmlObject: any = new XMLParser().parse(fileDataXml);

        const jsXmlObject: SalesRaportFileDateInfo = {
            xmlObject,
            originFileName: this.getFileName(raportFile)
        }

        const xmlResult = new XMLBuilder().build(jsXmlObject.xmlObject);

        console.log(xmlResult);

        throw Error("Function not implemented.")
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