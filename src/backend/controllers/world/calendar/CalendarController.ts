import {AbstractController} from "../../Base/AbstractController";
import {Calendar} from "../../../entity/calendar/Calendar";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {inject, injectable} from "inversify";
import {NameValuePair} from "../../Base/NameValuePair";
import {TYPES} from "../../../../types";
import {CalendarEraController} from "./CalendarEraController";
import {CalendarMonthController} from "./CalendarMonthController";
import {CalendarMoonController} from "./CalendarMoonController";
import {CalendarWeekDayController} from "./CalendarWeekDayController";
import {DateController} from "./DateController";

@injectable()
export class CalendarController extends AbstractController<Calendar> {
    private eras: CalendarEraController;
    private months: CalendarMonthController;
    private moons: CalendarMoonController;
    private days: CalendarWeekDayController;
    private dateController: DateController;

    constructor(@inject(TYPES.CalendarEraController) eras: CalendarEraController,
                @inject(TYPES.CalendarMonthController) months: CalendarMonthController,
                @inject(TYPES.CalendarMoonController) moons: CalendarMoonController,
                @inject(TYPES.CalendarWeekDayController) days: CalendarWeekDayController,
                @inject(TYPES.DateController) dateController: DateController) {
        super(TableName.CALENDAR);
        this.eras = eras;
        this.months = months;
        this.moons = moons;
        this.days = days;
        this.dateController = dateController;
    }

    public async save(calendar: Calendar): Promise<Calendar> {
        // To save properly, must delete.
        if (calendar.id == null) {
            delete calendar.id;
        }

        calendar = await this.getRepo().save(calendar).catch((err) => {
            console.log("ERR ::: Could not save new calendar.");
            console.log(err);
            return null;
        });

        if (calendar == null) {
            return Promise.resolve(null);
        }

        // Must save the days.
        calendar.week = await this.days.save(calendar.week, calendar.id || null);

        // Must save the months.
        calendar.months = await this.months.save(calendar.months, calendar.id || null);

        // Must save the moons.
        calendar.moons = await this.moons.save(calendar.moons, calendar.id || null);

        // Must save the eras.
        calendar.eras = await this.eras.save(calendar.eras, calendar.id || null);

        // Must save Epoch.
        calendar.epoch = await this.dateController.save(calendar.epoch);

        return calendar;
    }

    public async get(id: string): Promise<Calendar> {
        return this.getRepo().findOne({
                where: {id: id},
                relations: ["eras", "months", "moons", "week"]
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get calendars with given id.");
                console.error(err);
                return null;
            });
    }

    /**
     * Gets the calendar by name.
     *
     * @param calendarName The name of the calendar to find.
     * @param worldId The ID of the world the  calendar exists in.
     */
    public async getByName(calendarName: string, worldId: string): Promise<Calendar[]> {
        return this.getLikeArgs(
            [new NameValuePair("world_id", worldId)],
            [new NameValuePair("name", calendarName)])
            .catch((err: Error) => {
                console.error("ERR ::: Could not get calendars with given name.");
                console.error(err);
                return null;
            });
    }
}