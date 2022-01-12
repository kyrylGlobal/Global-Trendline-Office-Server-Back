import { Request, Response } from "express";
import RaportService from "../services/RaportService";

class RaportController{

    raportSales(req: Request,res: Response){
        if(!req.files){
            res.status(400).send("No files were uploaded!");
        }
        else{
            const raportFile = req.files.raport;

            try{
                const fileData = RaportService.getDataString(raportFile);
                
                res.status(200).end(fileData);
            }
            catch(error: any | unknown){
                res.status(500).end(error.message);
            }
        }
    }
}

export default new RaportController();