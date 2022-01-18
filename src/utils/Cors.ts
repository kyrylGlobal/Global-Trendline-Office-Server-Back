import { CorsOptions } from 'cors';
import {Request} from 'express';

class Cors{
    allowDevCors(req: Request, callBack: Function){
        const options: CorsOptions = {};
        const allowDevOrigins: string[] = ['http://localhost:3000', 'http://192.168.1.150:3000'];

        if(allowDevOrigins.includes(req.header("Origin") as string)){
            options.origin = true;
        }
        else{
            options.origin = false;
        }
        
        return callBack(null, options);
    }
}

export default new Cors();