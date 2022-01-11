import express, {Request, Response, Express} from "express";
import dotenv from "dotenv";
import raportRouter from "./src/routers/raportRouter";
import fileUpload from "express-fileupload";

dotenv.config();

const PORT: string | undefined = process.env.PORT;

const app: Express = express();

app.use(fileUpload());

app.use("/api/raport", raportRouter);

app.get('/', (req: Request, res: Response) => {
    res.end("It is work");
})

app.listen(PORT, () => console.log(`Server running on port - ${PORT}.\nLink - http://localhost:${PORT}`));