import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMonth} from "../../../entity/calendar/CalendarMonth";

@injectable()
export class CalendarMonthController extends AbstractController<CalendarMonth> {
    constructor() {
        super(TableName.MONTH);
    }

    public async save(month: CalendarMonth[], calendarId: string): Promise<CalendarMonth[]> {
        if (calendarId != null) {
            this.delete(calendarId, month);
        }

        if (!month || month.length < 1) {
            return Promise.resolve(null);
        }

        // Give them all the calendar.
        month.forEach((item) => {
            item.calendarId = calendarId;
        });

        return this.getRepo().save(month);
    }

    public async delete(calendarId: string, items: CalendarMonth[]): Promise<boolean> {
        return this.deleteBulk(calendarId, items);
    }
}