import {injectable} from "inversify";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMoonPhase} from "../../../entity/calendar/CalendarMoonPhase";
import {getManager} from "typeorm";
import {AbstractCalendarController} from "./AbstractCalendarController";

@injectable()
export class CalendarMoonPhaseController extends AbstractCalendarController<CalendarMoonPhase> {
    constructor() {
        super(TableName.MOON_PHASE);
    }

    public async save(items: CalendarMoonPhase[], moonId: string): Promise<CalendarMoonPhase[]> {
        return this.saveBulk(items, moonId, 'moonId');
    }
}