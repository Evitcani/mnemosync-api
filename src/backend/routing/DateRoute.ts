import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {DateConverter} from "../../shared/models/dto/converters/vo-to-dto/DateConverter";
import {GameDate} from "../entity/GameDate";
import {DateController} from "../controllers/world/calendar/DateController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";

@injectable()
export class DateRoute extends AbstractRoute<DateController, DateConverter, GameDate> {
    constructor(@inject(TYPES.DateController) specialChannelController: DateController) {
        super(specialChannelController, new DateConverter());
    }

    protected async controllerCreate(item: GameDate): Promise<GameDate> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}