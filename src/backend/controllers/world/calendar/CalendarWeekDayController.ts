import {injectable} from "inversify";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarWeekDay} from "../../../entity/calendar/CalendarWeekDay";
import {AbstractCalendarController} from "./AbstractCalendarController";

@injectable()
export class CalendarWeekDayController extends AbstractCalendarController<CalendarWeekDay> {
    constructor() {
        super(TableName.WEEK_DAY);
    }

    public async save(items: CalendarWeekDay[], calendarId: string): Promise<CalendarWeekDay[]> {
        return this.saveBulk(items, calendarId, 'calendarId');
    }
}