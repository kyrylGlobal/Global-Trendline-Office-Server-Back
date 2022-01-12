import { UploadedFile } from "express-fileupload";
import path from "path";
import { SalesRaportFileInfo } from "../interfaces/Files";

const RAPORT_FILE_DIRECTORY = path.resolve(`${process.cwd()}`, "public");

class RaportService{
    saveFile(file: UploadedFile | UploadedFile[]): SalesRaportFileInfo {
        if(Array.isArray(file)){
            throw new Error("Can not work with array right now.")
        }
        else{
            const fileInfo: SalesRaportFileInfo = {
                filePath: this.#createFilePathToSave(file.name, file.mimetype),
                originFileName: file.name
            }

            file.mv(fileInfo.filePath);

            return fileInfo;
        }
    }

    getDataString(file: UploadedFile | UploadedFile[]): string {
        if(Array.isArray(file)){
            throw new Error("Can not work with array right now.")
        }
        else{
            const fileString: string = file.data.toString('utf-8');

            return fileString;
        }
    }

    convertXmlToJsObject(data: string){

    }

    #createFilePathToSave(fileName: string, mimetype: string): string{
        if(mimetype === 'application/xml'){
            return path.resolve(RAPORT_FILE_DIRECTORY, `${fileName}`);
        }
        else{
            throw new Error(`Can not understand file type. File type is ${mimetype}.`);
        }
    }
}

export default new RaportService;