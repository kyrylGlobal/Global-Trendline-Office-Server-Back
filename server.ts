import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import raportRouter from "./src/routers/raportRouter";
import fileUpload from "express-fileupload";
import Logger from "./src/utils/Logger";
import cors from 'cors';
import Cors from "./src/utils/Cors";
import Errors from "./src/utils/Errors";
import baselinkerRouter from "./src/routers/baselinkerRouter";

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

app.listen(PORT, () => {
    console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`);
    // const fileDataXml = Files.readFileSync("./public/testFIles/at_test.xml");
    // const xmlResult = resolveSalesRaport(fileDataXml);
    // Files.writeFileSync('./public/testFIles/finish_at_test.xml', xmlResult);
});