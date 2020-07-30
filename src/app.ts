import * as express from "express";
import { Application, Request, Response } from 'express';
import {OktaJwtVerifier} from '@okta/jwt-verifier';

export class App {
    private app: Application;
    private port = process.env.PORT;
    private oktaJwtVerifier: OktaJwtVerifier;

    constructor () {
        this.app = express();
        this.setup();
        this.oktaJwtVerifier = new OktaJwtVerifier({
            issuer: process.env.ISSUER,
            clientId: process.env.CLIENT_ID
        })
    }

    private setup() {
        this.app.use(this.isAuthorized);

        this.app.get("/api/user/:id", async (req: Request, res: Response) => {
            let params = req.params;
            let discordId = params.id;
            if (discordId == null) {
                return res.status(400);
            }
            return res.status(200).send("Hello, world!");
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






