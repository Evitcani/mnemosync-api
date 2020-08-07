import {AbstractRoute} from "./AbstractRoute";
import {Application} from "express";
import {GameDate} from "../entity/GameDate";
import {DateController} from "../controllers/world/calendar/DateController";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {DateConverter} from "../../shared/models/converters/DateConverter";
import {DateDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DateDTO";

@injectable()
export class DateRoute extends AbstractRoute<DateController, DateConverter, GameDate, DateDTO> {
    constructor(@inject(TYPES.DateController) dateController: DateController,
                @inject(TYPES.DateConverter) dateConverter: DateConverter) {
        super(`dates`, dateController, new DateConverter());
    }

    protected async controllerCreate(item: GameDate): Promise<GameDate> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}