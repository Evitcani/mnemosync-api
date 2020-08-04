import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarEra} from "../../../entity/calendar/CalendarEra";

@injectable()
export class CalendarEraController extends AbstractController<CalendarEra> {
    constructor() {
        super(TableName.ERA);
    }

    public async save(era: CalendarEra[], calendarId: string): Promise<CalendarEra[]> {
        if (calendarId != null) {
            this.delete(calendarId, era);
        }
        if (!era || era.length < 1) {
            return Promise.resolve(null);
        }

        // Give them all the calendar.
        era.forEach((item) => {
            item.calendarId = calendarId;
        });
        return this.getRepo().save(era);
    }

    public async delete(calendarId: string, items: CalendarEra[]): Promise<boolean> {
        return this.deleteBulk(calendarId, items);
    }
}