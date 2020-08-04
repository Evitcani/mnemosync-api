import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {CurrentDate} from "../entity/CurrentDate";
import {CurrentDateController} from "../controllers/world/calendar/CurrentDateController";
import {CurrentDateConverter} from "../../shared/models/dto/converters/vo-to-dto/CurrentDateConverter";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";

@injectable()
export class CurrentDateRoute extends AbstractRoute<CurrentDateController, CurrentDateConverter, CurrentDate> {
    constructor(@inject(TYPES.CurrentDateController) specialChannelController: CurrentDateController) {
        super(specialChannelController, new CurrentDateConverter());
    }

    protected async controllerCreate(item: CurrentDate): Promise<CurrentDate> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}