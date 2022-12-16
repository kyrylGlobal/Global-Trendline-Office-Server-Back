import { NextFunction, Request, Response } from "express";

class Errors {
    errorHandler(error: Error, req: Request, res: Response, next: NextFunction){
        const message: string = error.message || "Somesing went wrong";
        console.log(error);
        res.status(500).send({message});
    }
}

export default new Errors();