import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import RaportService from "../services/RaportService";

class RaportController{

    raportSales(req: Request,res: Response){
        if(!req.files){
            res.status(400).send("No files were uploaded!");
        }
        else{
            try{
                if(Array.isArray(req.files.raport)){
                    throw new Error("Can not accept several files. Please send me just one file.")
                }
                else{
                    const raportFile: UploadedFile = req.files.raport;
                    const xmlResultData = RaportService.generateXmlResultFileData(raportFile);
    
                    res.attachment(raportFile.name); // res.setHeader('Content-type', "application/octet-stream"); res.setHeader('Content-disposition', 'attachment; filename=file.txt');
                    res.status(200).send(xmlResultData);
                }
            }
            catch(error: any | unknown){
                res.status(500).end(error.message);
            }
        }
    }
}

export default new RaportController();