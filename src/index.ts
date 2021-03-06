import "reflect-metadata";
require('dotenv').config();
import {createConnection} from "typeorm";
import {App} from "./app";
import container from "./inversify.config";
import {TYPES} from "./types";

let app: App = container.get<App>(TYPES.App);

createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [
        __dirname + "/backend/entity/**/*.js"
    ],
    synchronize: true,
}).then(() => {
    app.setup();
}).catch((err: Error) => {
    console.log('Unable to create connection!');
    console.error(err);
});

