import {AbstractRoute} from "./AbstractRoute";
import {CalendarController} from "../controllers/world/calendar/CalendarController";
import {Calendar} from "../entity/calendar/Calendar";
import {Application, Request, Response} from "express";
import {inject, injectable} from "inversify";
import {TYPES} from "../../types";
import {CalendarConverter} from "../../shared/models/converters/calendars/CalendarConverter";

/**
 * Controls the calendars.
 */
@injectable()
export class CalendarRoute extends AbstractRoute<CalendarController, CalendarConverter, Calendar> {
    constructor(@inject(TYPES.CalendarController) controller: CalendarController) {
        super(`calendars`, controller, new CalendarConverter());
    }

    /**
     * Defines how the controller saves an item.
     *
     * @param item The item to save.
     */
    protected async controllerCreate(item: Calendar): Promise<Calendar> {
        return this.controller.save(item).catch((err) => {
            console.error("ERR ::: Something went wrong inside the calendar router.");
            console.error(err);
            return null;
        });
    }

    public defineRoutes(app: Application): void {
        app.route(`${this.getBaseUrl()}`)
            .post((req: Request, res: Response) => {
                console.log("Begin processing calendar...");
                return this.doBasicPost(req, res).catch((err: Error) => {
                    console.error("Something went wrong during POST of calendar.");
                    console.error(err);
                    return this.sendBadRequestResponse(res);
                });
            })
            .get((req: Request, res: Response) => {
                return this.getByQuery(req, res);
            });
        app.route(`${this.getBaseUrl()}/:id`)
            .put((req: Request, res: Response) => {
                let idStr: string = this.getStringIdFromPath(req);
                if (!idStr) {
                    return this.sendBadRequestResponse(res);
                }

                return this.doBasicPost(req, res, idStr);
            })
            .get((req: Request, res: Response) => {
                return this.getById(req, res);
            });
    }

    private async getById(req: Request, res: Response) {
        let idStr: string = this.getStringIdFromPath(req);
        if (!idStr) {
            return this.sendBadRequestResponse(res);
        }

        let calendar = await this.controller.get(idStr);
        return this.sendOKResponse(res, calendar);
    }

    private async getByQuery(req: Request, res: Response) {
        let query: any = this.parseQuery(req, ["name", "world_id"]);
        if (query.name != null || query.world_id != null) {
            return this.sendBadRequestResponse(res);
        }

        let calendars = await this.controller.getByName(query.name, query.world_id);
        return this.sendOKResponseMulti(res, calendars);
    }
}