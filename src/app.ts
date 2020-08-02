import * as express from "express";
import { Application, Request, Response } from 'express';
import {OktaJwtVerifier} from '@okta/jwt-verifier';
import {UserDTO} from "./shared/models/dto/model/UserDTO";
import bodyParser from "body-parser";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {UserController} from "./backend/controllers/user/UserController";
import {UserConverter} from "./shared/models/dto/converters/vo-to-dto/UserConverter";
import {DataDTO} from "./shared/models/dto/model/DataDTO";

@injectable()
export class App {
    private app: Application;
    private port = process.env.PORT;
    private oktaJwtVerifier: OktaJwtVerifier;

    private userController: UserController;

    constructor (@inject(TYPES.UserController) userController: UserController,) {
        this.app = express();
        this.oktaJwtVerifier = new OktaJwtVerifier({
            issuer: process.env.ISSUER,
            clientId: process.env.CLIENT_ID
        });

        this.userController = userController;
    }

    public setup() {
        this.app.use(bodyParser.json());
        this.app.use(this.isAuthorized);

        this.app.get("/api/user/:id", async (req: Request, res: Response) => {
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

        this.app.post("/api/user/:id", async (req: Request, res: Response) => {
            let params = req.params;
            let discordId = params.id;
            if (discordId == null) {
                return res.status(400);
            }

            let data: DataDTO = null;
            if (req.body != null) {
                data = req.body;
            }

            if (data == null || data.data == null) {
                return res.status(400);
            }

            let dtoAdd: UserDTO = data;
            let dtoRemove: UserDTO = data;
            let dtoUpdate: UserDTO = data;
            let vo = await this.userController.save(dto.discord_id, dto.discord_name);

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

    private async isAuthorized(req: Request, res, next) {
        try {
            const authorization: string = req.header("Authorization");
            if (!authorization) {
                throw new Error('You must send an Authorization header');
            }

            const [authType, token] = authorization.trim().split(' ');
            if (authType !== 'Bearer') {
                throw new Error('Expected a Bearer token');
            }

            const { claims } = await this.oktaJwtVerifier.verifyAccessToken(token);
            if (!claims.scp.includes(process.env.SCOPE)) {
                throw new Error('Could not verify the proper scope')
            }
            next();
        } catch (error) {
            next(error.message)
        }
    }
}






