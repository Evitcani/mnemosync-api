import {inject, injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CalendarMoon} from "../../../entity/calendar/CalendarMoon";
import {Calendar} from "../../../entity/calendar/Calendar";
import {getManager} from "typeorm";
import {CalendarMoonPhaseController} from "./CalendarMoonPhaseController";
import {TYPES} from "../../../../types";

@injectable()
export class CalendarMoonController extends AbstractController<CalendarMoon> {
    private phases: CalendarMoonPhaseController;

    constructor(@inject(TYPES.CalendarMoonPhaseController) phases: CalendarMoonPhaseController) {
        super(TableName.MOON);
        this.phases = phases;
    }

    public async save(moons: CalendarMoon[], calendarId: string): Promise<CalendarMoon[]> {
        if (calendarId != null) {
            this.delete(calendarId, moons);
        }

        if (!moons || moons.length < 1) {
            return Promise.resolve(null);
        }

        // Give them all the calendar.
        moons.forEach((item) => {
            item.calendarId = calendarId;
        });

        let moonRet: CalendarMoon[] = [];
        for (const moon of moons) {
            moon.calendar

            // If this moon exists, we need to delete the phases it has deleted.
            if (moon.id != null) {
                await this.phases.delete(moon, moon.phases);
            }

            let savedMoon = await this.getRepo().save(moon);
            if (moon.phases != null && moon.phases.length <= 0) {
                savedMoon.phases = await this.phases.save(moon.phases, savedMoon.id);
            }

            moonRet.push(savedMoon);
        }

        return Promise.resolve(moonRet);
    }

    public async delete(calendarId: string, items: CalendarMoon[]): Promise<boolean> {
        return this.deleteBulk(calendarId, items);
    }
}