import e, {Request, Response, NextFunction} from 'express';
import { addBarCodeToFile } from '../helpers/barcodeScanner';

class ScannerController {
    public async acceptBarCode(req: Request, res: Response, next: NextFunction) {
        if(req.body.barcode) {
            console.log(req.body.barcode);
            let fileWritingResponse = await addBarCodeToFile(req.body.barcode);
            res.status(200).send(fileWritingResponse);
        } else {
            console.log("Request body is empty");
            res.status(500).send("Problem");
        }
    }
}

export default new ScannerController();