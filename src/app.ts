import express from "express";
import {injectable} from "inversify";

export class App {
    private app;
    private port = 8080 || process.env.PORT;

    constructor () {
        this.app = express();
        this.setup();
    }

    private setup() {
        this.app.get("/api/help", (req, res) => {

        });

        this.app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at http://localhost:${this.port}`);
        });
    }
}






