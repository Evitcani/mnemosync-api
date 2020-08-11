import {inject, injectable} from "inversify";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMoon} from "../../../entity/calendar/CalendarMoon";
import {CalendarMoonPhaseController} from "./CalendarMoonPhaseController";
import {TYPES} from "../../../../types";
import {AbstractCalendarController} from "./AbstractCalendarController";

@injectable()
export class CalendarMoonController extends AbstractCalendarController<CalendarMoon> {
    private phases: CalendarMoonPhaseController;

    constructor(@inject(TYPES.CalendarMoonPhaseController) phases: CalendarMoonPhaseController) {
        super(TableName.MOON);
        this.phases = phases;
    }

    public async save(moons: CalendarMoon[], calendarId: string): Promise<CalendarMoon[]> {
        if (calendarId != null) {
            this.deleteBulk(calendarId, moons);
        }

        if (!moons || moons.length < 1) {
            return Promise.resolve(null);
        }

        let moonRet: CalendarMoon[] = [];
        for (const moon of moons) {
            moon.calendarId = calendarId;

            let savedMoon = await this.getRepo().save(moon);
            savedMoon.phases = await this.phases.save(moon.phases, savedMoon.id);

            moonRet.push(savedMoon);
        }

        return Promise.resolve(moonRet);
    }
}