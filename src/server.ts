import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import raportRouter from "./routers/raportRouter";
import fileUpload from "express-fileupload";
import cors from 'cors';
import Cors from "./utils/Cors";
import Errors from "./utils/Errors";
import baselinkerRouter from "./routers/baselinkerRouter";
import bp from "body-parser";
import path, { dirname } from "path";
import scannerRouter from "./routers/scannerRouter";
import { sendMailsFromCSV } from "./helpers/mailSender";

dotenv.config();
(global as any).mainFolderPath = path.resolve(__dirname, "..")

const PORT: string | undefined = process.env.PORT || "5000";

const app: Express = express();

app.use(cors());

app.use(bp.json());

app.use(bp.urlencoded({extended: true}));

app.use(fileUpload());

app.use("/api/raport/", raportRouter);

app.use("/api/baselinker", baselinkerRouter);

app.use("/api/scanner", scannerRouter);

app.get('/', (req: Request, res: Response) => {
    res.end("Works!");
});

app.use(Errors.errorHandler);

app.listen(PORT, async () => {
    console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`);
    // await sendMailsFromCSV(path.resolve(__dirname, "./db/mails/mails.csv"), {
    //     "Poland": 0,
    //     "Czech Republic": 0,
    //     "Hungary": 0,
    //     "Slovakia": 0,
    //     "Bulgaria": 0,
    //     "Lithuania": 0,
    //     "Austria": 0,
    //     "Latvia": 0,
    //     "Romania": 0
    // }, 100);
});