import {AbstractRoute} from "./AbstractRoute";
import {Application, Request, Response} from "express";
import {SpecialChannel} from "../entity/SpecialChannel";
import {SpecialChannelController} from "../controllers/user/SpecialChannelController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {SpecialChannelConverter} from "../../shared/models/converters/SpecialChannelConverter";
import {SpecialChannelDesignation} from "../../shared/enums/SpecialChannelDesignation";

@injectable()
export class SpecialChannelRoute extends AbstractRoute<SpecialChannelController, SpecialChannelConverter, SpecialChannel> {
    constructor(@inject(TYPES.SpecialChannelController) specialChannelController: SpecialChannelController) {
        super(specialChannelController, new SpecialChannelConverter());
    }

    protected async controllerCreate(item: SpecialChannel): Promise<SpecialChannel> {
        return this.controller.save(item);
    }

    public defineRoutes(app: Application): void {
        app.get(`/api/specialChannels`, (req, res) => {
            return this.getByParams(req, res);
        });

        app.post(`/api/specialChannels`, (req, res) => {
            return this.doBasicPost(req, res).catch((err) => {
                console.log(err);
                return null;
            });
        });

        app.put(`/api/specialChannels/:id`, (req, res) => {
            let id = this.getStringIdFromPath(req);
            if (!id) {
                return this.sendBadRequestResponse(res);
            }

            return this.doBasicPost(req, res, id);
        });
    }

    protected async getByParams(req: Request, res: Response) {
        let query: {
            guild_id?: string,
            designation?: SpecialChannelDesignation
        } = this.parseQuery(req, ['guild_id', 'designation']);

        let specialChannel = await this.controller.get(query.guild_id, query.designation);
        return this.getOKResponse(res, specialChannel);
    }
}