import * as express from "express";
import { Application, Request, Response } from 'express';
import * as bodyParser from "body-parser";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {UserController} from "./backend/controllers/user/UserController";
import {UserConverter} from "./shared/models/dto/converters/vo-to-dto/UserConverter";
import {DataDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DataDTO";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";
import container from "./inversify.config";
import {Authorization} from "./Authorization";

@injectable()
export class App {
    private app: Application;
    private port = process.env.PORT;


    private userController: UserController;

    constructor (@inject(TYPES.UserController) userController: UserController) {
        this.app = express();

        this.userController = userController;
    }

    public setup() {
        this.app.use(this.isAuthorized);
        //this.app.use(bodyParser.json());

        this.app.get("/api/users/:id", async (req: Request, res: Response) => {
            let params = req.params;
            let discordId = params.id;
            if (discordId == null) {
                return res.status(400);
            }

            let data: DataDTO = null;
            if (req.body != null) {
                data = req.body;
            }

            if (data == null || data.data == null || data.data.length <= 0) {
                return res.status(400);
            }

            let dto: UserDTO = data.data[0];
            let vo = await this.userController.get(dto.discord_id, dto.discord_name);

            if (vo == null) {
                return res.status(400);
            }

            return res.status(200).json(UserConverter.convertVoToDto(vo));
        });

        this.app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at ${this.port}`);
        });
    }

    private async isAuthorized(req: Request, res: Response, next) {
        try {
            console.debug("Begin authorization of request...");
            const authorization: string = req.header("Authorization");
            if (!authorization) {
                throw new Error('You must send an Authorization header');
            }

            console.debug("Authorization header found!");
            const [authType, token] = authorization.trim().split(' ');
            if (authType !== 'Bearer') {
                throw new Error('Expected a Bearer token');
            }

            console.debug("Proper token found!");
            let auth: Authorization = container.get<Authorization>(TYPES.Authorization);
            console.debug("Got authentication, starting verification process: " + auth);
            // @ts-ignore
            const jwt = await auth.verify(token, 'api').catch((err) => {
                console.log("Could not verify token.");
                return null;
            });
            // @ts-ignore
            if (!jwt || !jwt.claims.scp.includes(process.env.SCOPE)) {
                throw new Error('Could not verify the proper scope')
            }
            console.log("Completed authorization process successfully!");
            next();
        } catch (error) {
            console.error(error);
            next(error.message);
        }
    }
}






