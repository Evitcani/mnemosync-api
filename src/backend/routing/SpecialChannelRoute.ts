import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {SpecialChannelConverter} from "../../shared/models/dto/converters/vo-to-dto/SpecialChannelConverter";
import {SpecialChannel} from "../entity/SpecialChannel";
import {SpecialChannelController} from "../controllers/user/SpecialChannelController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";

@injectable()
export class SpecialChannelRoute extends AbstractRoute<SpecialChannelController, SpecialChannelConverter, SpecialChannel> {
    constructor(@inject(TYPES.SpecialChannelController) specialChannelController: SpecialChannelController) {
        super(specialChannelController, new SpecialChannelConverter());
    }

    protected async controllerCreate(item: SpecialChannel): Promise<SpecialChannel> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}