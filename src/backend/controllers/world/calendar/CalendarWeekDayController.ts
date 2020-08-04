import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarWeekDay} from "../../../entity/calendar/CalendarWeekDay";
import {getManager} from "typeorm";

@injectable()
export class CalendarWeekDayController extends AbstractController<CalendarWeekDay> {
    constructor() {
        super(TableName.WEEK_DAY);
    }

    public async save(weekDay: CalendarWeekDay[], calendarId: string): Promise<CalendarWeekDay[]> {
        if (calendarId != null) {
            this.delete(calendarId, weekDay);
        }
        if (!weekDay || weekDay.length < 1) {
            return Promise.resolve(null);
        }

        // Give them all the calendar.
        weekDay.forEach((item) => {
            item.calendarId = calendarId;
        });
        return getManager().getRepository(this.tableName).save(weekDay);
    }

    public async delete(calendarId: string, items: CalendarWeekDay[]): Promise<boolean> {
        return this.deleteBulk(calendarId, items);
    }
}