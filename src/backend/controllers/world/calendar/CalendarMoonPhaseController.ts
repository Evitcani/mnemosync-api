import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMoonPhase} from "../../../entity/calendar/CalendarMoonPhase";
import {CalendarMoon} from "../../../entity/calendar/CalendarMoon";
import {getManager} from "typeorm";

@injectable()
export class CalendarMoonPhaseController extends AbstractController<CalendarMoonPhase> {
    constructor() {
        super(TableName.MOON_PHASE);
    }

    public async save(phase: CalendarMoonPhase[], moonId: string): Promise<CalendarMoonPhase[]> {
        if (!phase || phase.length < 1) {
            return Promise.resolve(null);
        }

        // Give them all the calendar.
        phase.forEach((item) => {
            item.moonId = moonId;
        });
        return getManager().getRepository(this.tableName).save(phase);
    }

    public async delete(moon: CalendarMoon, phasesToKeep: CalendarMoonPhase[]): Promise<boolean> {
        return this.deleteBulk(moon.id, phasesToKeep);
    }
}