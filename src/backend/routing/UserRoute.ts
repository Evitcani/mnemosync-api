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
        app.get("/api/users/:id", this.getUser);
        app.put(``, this.put);
    }

    protected async put (req: Request, res: Response) {
        let params = req.params;
        let discordId = params.id;
        if (!discordId) {
            return res.status(400).json({data: null});
        }

        let obj = this.getBodyFromRequest(req);
        if (!obj) {
            return res.status(400).json({data: null});
        }

        obj = await this.controller.save(obj);
        if (!obj) {
            return res.status(400).json({data: null});
        }

        return this.getOKResponse(res, obj);
    }

    private async getUser(req: Request, res: Response) {
        let params = req.params;
        let discordId = params.id;
        // @ts-ignore
        let discordName: string = req.query.discord_name;
        if (discordId == null || discordName == null) {
            return res.status(400).json({data: null});
        }

        let vo = await this.controller.get(discordId, discordName);

        if (vo == null) {
            return res.status(400).json({data: null});
        }

        return this.getOKResponse(res, vo);
    }
}