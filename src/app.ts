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
import {CharacterController} from "./backend/controllers/character/CharacterController";
import {CharacterConverter} from "./shared/models/dto/converters/vo-to-dto/CharacterConverter";
import {PartyConverter} from "./shared/models/dto/converters/vo-to-dto/PartyConverter";

@injectable()
export class App {
    private app: Application;
    private port = process.env.PORT;

    private characterController: CharacterController;
    private userController: UserController;

    constructor (@inject(TYPES.CharacterController) characterController: CharacterController,
                 @inject(TYPES.UserController) userController: UserController) {
        this.app = express();
        this.characterController = characterController;
        this.userController = userController;
    }

    public setup() {
        this.app.use(this.isAuthorized);
        //this.app.use(bodyParser.json());

        this.app.get("/api/users/:id", async (req: Request, res: Response) => {
            let params = req.params;
            let discordId = params.id;
            // @ts-ignore
            let discordName: string = req.query.discord_name;
            if (discordId == null || discordName == null) {
                return res.status(400);
            }

            let vo = await this.userController.get(discordId, discordName);

            if (vo == null) {
                return res.status(400);
            }

            return App.getOKResponse(res, UserConverter.convertVoToDto(vo));
        });

        this.app.get("/api/parties", async (req: Request, res: Response) => {
            let query = req.query;
            // @ts-ignore
            let characterId: string = query.character_id;
            if (characterId == null) {
                return res.status(400);
            }

            let character = await this.characterController.getById(characterId);

            if (character == null || character.party == null) {
                return res.status(200).json({data: null});
            }

            return App.getOKResponse(res, PartyConverter.convertVoToDto(character.party));
        });

        this.app.listen(this.port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at ${this.port}`);
        });
    }

    private static getOKResponse(res: Response, item: any) {
        return res.status(200).json({data: item});
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






