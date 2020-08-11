import {injectable} from "inversify";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarEra} from "../../../entity/calendar/CalendarEra";
import {AbstractCalendarController} from "./AbstractCalendarController";

@injectable()
export class CalendarEraController extends AbstractCalendarController<CalendarEra> {
    constructor() {
        super(TableName.ERA);
    }

    public async save(items: CalendarEra[], calendarId: string): Promise<CalendarEra[]> {
        return this.saveBulk(items, calendarId, 'calendarId');
    }
}