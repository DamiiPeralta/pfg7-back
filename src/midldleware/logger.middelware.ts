import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        const timestamp = new Date().toISOString();

        console.log(
            `[${timestamp}]Estas ejecutando un metodo ${req.method} en la ruta ${req.url}`
        );
        next();
    }
}

export function loggerGlobal(req:Request, res:Response,  next: NextFunction){
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]Estas ejecutando un metodo ${req.method} en la ruta ${req.url}`);
    next();
}