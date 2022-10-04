import { Router } from "express";
import ScannerController from "../controllers/ScannerController";

const scannerRouter = Router();

scannerRouter.post("", (req, res, next) => {
    ScannerController.acceptBarCode(req, res, next);
})

export default scannerRouter;