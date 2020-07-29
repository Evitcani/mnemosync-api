import * as express from "express";
import { Application, Request, Response } from 'express';

export class App {
    private app: Application;
    private port = process.env.PORT;

    constructor () {
        this.app = express();
        this.setup();
    }

    private setup() {
        this.app.get("/api/user/:id", (req: Request, res: Response) => {
            return res.status(200).send("Hello, world!");
        });

        this.app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at ${this.port}`);
        });
    }
}






