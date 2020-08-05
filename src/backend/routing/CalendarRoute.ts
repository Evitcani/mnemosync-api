import {AbstractRoute} from "./AbstractRoute";
import {CalendarController} from "../controllers/world/calendar/CalendarController";
import {Calendar} from "../entity/calendar/Calendar";
import {Application} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {CalendarConverter} from "../../shared/models/converters/calendars/CalendarConverter";

@injectable()
export class CalendarRoute extends AbstractRoute<CalendarController, CalendarConverter, Calendar> {
    constructor(@inject(TYPES.CalendarController) controller: CalendarController) {
        super(`calendars`, controller, new CalendarConverter());
    }

    protected async controllerCreate(item: Calendar): Promise<Calendar> {
        return this.controller.save(item);
    }

    defineRoutes(app: Application): void {

    }
}