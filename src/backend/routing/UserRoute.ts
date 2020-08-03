import {AbstractRoute} from "./AbstractRoute";
import {UserController} from "../controllers/user/UserController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {Application, Request, Response} from "express";
import {UserConverter} from "../../shared/models/dto/converters/vo-to-dto/UserConverter";
import {User} from "../entity/User";

@injectable()
export class UserRoute extends AbstractRoute<UserController, UserConverter, User> {
    constructor(@inject(TYPES.UserController) userController: UserController) {
        super(userController, new UserConverter());
    }

    defineRoutes(app: Application): void {
        app.get("/api/users/:id", (req, res) => {
            return this.getUser(req, res);
        });
        app.put(`/api/users/:id`, (req, res) => {
            let discordId: string = this.getStringIdFromPath(req);
            if (!discordId) {
                return this.sendBadRequestResponse(res);
            }
            return this.doBasicPost(req, res, discordId);
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

        return this.getOKResponse(res, vo);
    }

    protected async controllerCreate(item: User): Promise<User> {
        return this.controller.save(item);
    }
}