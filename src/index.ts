import "reflect-metadata";
require('dotenv').config();
import {createConnection} from "typeorm";
import {App} from "./app";

createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    entities: [
        __dirname + "/backend/entity/**/*.js"
    ],
    synchronize: true,
}).then(() => {
    new App();
}).catch((err: Error) => {
    console.log('Unable to create connection!');
    console.error(err);
});

