import {AbstractRoute} from "./AbstractRoute";
import {UserController} from "../controllers/user/UserController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {Application, Request, Response} from "express";
import {User} from "../entity/User";
import {UserConverter} from "../../shared/models/converters/UserConverter";

@injectable()
export class UserRoute extends AbstractRoute<UserController, UserConverter, User> {
    constructor(@inject(TYPES.UserController) userController: UserController) {
        super(`users`, userController, new UserConverter());
    }

    defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}/:id`)
            .get((req, res) => {
                return this.getUser(req, res);
            })
            .put((req, res) => {
                let id: number = this.getNumberIdFromPath(req);
                if (!id) {
                    return this.sendBadRequestResponse(res);
                }
                return this.doBasicPost(req, res, id, "discord_id");
            });
    }

    private async getUser(req: Request, res: Response) {
        let discordId: string = this.getStringIdFromPath(req);
        if (!discordId) {
            return this.sendBadRequestResponse(res);
        }
        // @ts-ignore
        let discordName: string = req.query.discord_name;
        if (discordName == null) {
            return this.sendBadRequestResponse(res);
        }

        let vo = await this.controller.get(discordId, discordName);

        if (vo == null) {
            return this.sendBadRequestResponse(res);
        }

        return this.sendOKResponse(res, vo);
    }

    protected async controllerCreate(item: User): Promise<User> {
        return this.controller.save(item);
    }
}