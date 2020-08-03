import * as express from "express";
import {Application, Request} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import container from "./inversify.config";
import {Authorization} from "./Authorization";
import {PartyRoute} from "./backend/routing/PartyRoute";
import {UserRoute} from "./backend/routing/UserRoute";
import {AbstractRoute} from "./backend/routing/AbstractRoute";
import {SwaggerUI} from "../swagger/SwaggerUI";
import {DiscordIDRoute} from "./backend/routing/DiscordIDRoute";
import {CharacterRoute} from "./backend/routing/CharacterRoute";

@injectable()
export class App {
    private readonly app: Application;
    private port = process.env.PORT;

    private routes: AbstractRoute<any, any, any>[];

    constructor (@inject(TYPES.CharacterRoute) characterRoute: CharacterRoute,
                 @inject(TYPES.DiscordIDRoute) discordIDRoute: DiscordIDRoute,
                 @inject(TYPES.PartyRoute) partyRoute: PartyRoute,
                 @inject(TYPES.UserRoute) userRoute: UserRoute,) {
        this.app = express();
        this.routes = [];
        this.routes.push(characterRoute);
        this.routes.push(discordIDRoute);
        this.routes.push(partyRoute);
        this.routes.push(userRoute);
    }

    public setup() {
        SwaggerUI.setupRoutes(this.app);

        this.app.use(this.isAuthorized);
        //this.app.use(bodyParser.json());

        // Define all routes.
        this.routes.forEach((route) => {
            route.defineRoutes(this.app);
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
            let auth: Authorization = container.get<Authorization>(TYPES.Authorization);
            // @ts-ignore
            const jwt = await auth.verify(token, 'api').catch(() => {
                console.log("Could not verify token.");
                return null;
            });
            // @ts-ignore
            if (!jwt || !jwt.claims.scp.includes(process.env.SCOPE)) {
                throw new Error('Could not verify the proper scope')
            }
            next();
        } catch (error) {
            console.error(error);
            next(error.message);
        }
    }
}






