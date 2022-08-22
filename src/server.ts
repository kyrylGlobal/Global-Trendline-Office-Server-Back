import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import raportRouter from "./routers/raportRouter";
import fileUpload from "express-fileupload";
import cors from 'cors';
import Cors from "./utils/Cors";
import Errors from "./utils/Errors";
import baselinkerRouter from "./routers/baselinkerRouter";
import bp from "body-parser";

dotenv.config();

const PORT: string | undefined = process.env.PORT || "5000";

const app: Express = express();

app.use(cors(Cors.allowDevCors));

app.use(bp.json());

app.use(bp.urlencoded({extended: true}));

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
    // setInterval(() => {
    //     const curDate = new Date();
    //     console.log(`Cur time is ${curDate.getHours()}:${curDate.getMinutes()}:${curDate.getSeconds()}`)
    // }, 1000);

    // const dateFrom = new Date(2022, 7, 6);
    // const dateTo = new Date();

    // generateHeatersStatistic(DateTime.convertDateToUnix(dateFrom), DateTime.convertDateToUnix(dateTo));
});

