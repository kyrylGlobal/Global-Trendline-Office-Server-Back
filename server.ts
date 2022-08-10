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
import { createValues, getLastGoogleSheetRowNumber, setLastGoogleSheetRowNumber } from "./src/helpers/baselinker";
import DateTime from "./src/utils/DateTime";
import Google from "./src/services/GoogleSheetApiController";

dotenv.config();

const PORT: string | undefined = process.env.PORT || "5000";

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


    setInterval(async () => {
        const curDateime = new Date();
        const curDate = `${curDateime.getDate()}.${curDateime.getMonth() + 1}.${curDateime.getFullYear()}`;
        console.log(curDate);
        if(curDateime.getHours() === 23 && curDateime.getMinutes() > 55 && curDateime.getMinutes() < 59) {
            const lastInfo = getLastGoogleSheetRowNumber();
            if(lastInfo.lastDate !== curDate) {
                const baselinkerController = new BaselinkerApiController();
                const orders = await baselinkerController.getOrders({
                    dateFrom: DateTime.getCurDayUnix().toString()
                });
                
                const values = createValues(orders);

                const googleApi = new Google("1lMRIjyb0Qlz4BtOaf2OQWczpDN-NxEhXNHRkLMYYJDY");
                await googleApi.addData("Enter", `A${lastInfo.lastRow}`, values);
                setLastGoogleSheetRowNumber(values.length, curDate);
            }
        }
    }, 1000 * 120)

});

