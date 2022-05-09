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
import { parseWoocomersJsonOrdersToBaselinker } from "./src/helpers/baselinker";

dotenv.config();

const PORT: string | undefined = process.env.PORT;

const app: Express = express();

app.use(cors(Cors.allowDevCors));

app.use(Logger.logRequest())

app.use(fileUpload());

app.use("/api/raport", raportRouter);

app.use("/api/baselinker", baselinkerRouter);

app.get('/', (req: Request, res: Response) => {
    res.end("Works!");
});

app.use(Errors.errorHandler);

app.listen(PORT, async () => {
    console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`);
    const baselinkerApiController = new BaselinkerApiController();
    // const fileDataXml = Files.readFileSync("./public/testFIles/at_test.xml");
    // const xmlResult = resolveSalesRaport(fileDataXml);
    const woocomerceOrders = JSON.parse(Files.readFileSync('./src/db/orders/orders.json'));
    let parsedBaselinkerOrders = parseWoocomersJsonOrdersToBaselinker(woocomerceOrders, await (baselinkerApiController.getOrderStatusIdByName("New Orders")));
    const baselinkerOrdersFromFolder = await baselinkerApiController.getOrders(await (baselinkerApiController.getOrderStatusIdByName("Return by code")));
    parsedBaselinkerOrders = parsedBaselinkerOrders.filter( order => {
        for(let folderOrders of baselinkerOrdersFromFolder) {
            if(folderOrders.shop_order_id.toString() === order.custom_source_id?.toString()) {
                return false;
            }
        }
        return true;
    })
    baselinkerApiController.addOrders(parsedBaselinkerOrders);
    console.log();

    // Files.writeFileSync('./public/testFIles/finish_at_test.xml', xmlResult);
});