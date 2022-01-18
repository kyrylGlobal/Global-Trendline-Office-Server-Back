import path from 'path';
import {NextFunction, Request, Response} from 'express';
import DateTime from './DateTime';
import Files from './Files';

class Logger{
    #requestLogFilePath: string = path.resolve(process.cwd(), "public", "logs", 'requestLogs.txt');

    logRequest(){
        return async (req: Request, res: Response, next: NextFunction) => {
            try{
                const info = `[${DateTime.getCurDate()}],[${DateTime.getCurTime()}]-[${req.method}],[${req.url}],[${req.ips},[${req.get("user-agent")}]]`;
                await Files.appendFile(this.#requestLogFilePath, `${info}\n`);
                next();
            }
            catch(error: any | undefined){
                next(new Error(error));
            }
        }
    }
}

export default new Logger();