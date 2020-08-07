import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {CurrentDate} from "../entity/CurrentDate";
import {CurrentDateController} from "../controllers/world/calendar/CurrentDateController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {CurrentDateConverter} from "../../shared/models/converters/CurrentDateConverter";
import {CurrentDateDTO} from "@evitcani/mnemoshared/dist/src/dto/model/CurrentDateDTO";

@injectable()
export class CurrentDateRoute extends AbstractRoute<CurrentDateController, CurrentDateConverter, CurrentDate, CurrentDateDTO> {
    constructor(@inject(TYPES.CurrentDateController) specialChannelController: CurrentDateController) {
        super(`currentDates`, specialChannelController, new CurrentDateConverter());
    }

    protected async controllerCreate(item: CurrentDate): Promise<CurrentDate> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}