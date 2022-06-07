import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import raportRouter from "./src/routers/raportRouter";
import fileUpload from "express-fileupload";
import Logger from "./src/utils/Logger";
import cors from 'cors';
import Cors from "./src/utils/Cors";
import Errors from "./src/utils/Errors";
import baselinkerRouter from "./src/routers/baselinkerRouter";
import BaselinkerApiController from "./src/services/BaselinkerApiController";
import Files from "./src/utils/Files";
import { addOrdersToBaselinker, parseWoocomersJsonOrdersToBaselinker } from "./src/helpers/baselinker";
import { sendGmail, sendMailsFromCSV } from "./src/helpers/mailSender";
import country from "./src/config/config";
import { resolveSalesRaport } from "./src/helpers/fast-xml-parser";
import DateTime from "./src/utils/DateTime";

dotenv.config();

const PORT: string | undefined = process.env.PORT;

const app: Express = express();

app.use(cors(Cors.allowDevCors));

app.use(Logger.logRequest())

app.use(fileUpload());

app.use("/api/raport/", raportRouter);

app.use("/api/baselinker", baselinkerRouter);

app.get('/', (req: Request, res: Response) => {
    res.end("Works!");
});

app.use(Errors.errorHandler);

app.listen(PORT, async () => {
    console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`);
    // const fileDataXml = Files.readFileSync("./public/testFIles/at_test.xml");
    // const xmlResult = resolveSalesRaport(fileDataXml);
    // addOrdersToBaselinker();
    // sendMailsFromCSV('./src/db/mails/mails.json');

    // Files.writeFileSync('./public/testFIles/finish_at_test.xml', xmlResult);
});