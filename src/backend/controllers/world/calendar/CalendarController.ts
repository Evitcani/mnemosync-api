import {AbstractController} from "../../Base/AbstractController";
import {Calendar} from "../../../entity/calendar/Calendar";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {injectable} from "inversify";
import {NameValuePair} from "../../Base/NameValuePair";

@injectable()
export class CalendarController extends AbstractController<Calendar> {
    constructor() {
        super(TableName.CALENDAR);
    }

    public async save(calendar: Calendar): Promise<Calendar> {
        return this.getRepo().save(calendar);
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