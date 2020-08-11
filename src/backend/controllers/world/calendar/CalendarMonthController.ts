import {injectable} from "inversify";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMonth} from "../../../entity/calendar/CalendarMonth";
import {AbstractCalendarController} from "./AbstractCalendarController";

@injectable()
export class CalendarMonthController extends AbstractCalendarController<CalendarMonth> {
    constructor() {
        super(TableName.MONTH);
    }

    public async save(items: CalendarMonth[], calendarId: string): Promise<CalendarMonth[]> {
        return this.saveBulk(items, calendarId, 'calendarId');
    }
}