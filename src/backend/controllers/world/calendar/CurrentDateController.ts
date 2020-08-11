import {inject, injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {TableName} from "../../../../shared/documentation/databases/TableName";
import {CurrentDate} from "../../../entity/CurrentDate";
import {TYPES} from "../../../../types";
import {DateController} from "./DateController";

@injectable()
export class CurrentDateController extends AbstractController<CurrentDate> {
    private dateController: DateController;

    constructor(@inject(TYPES.DateController) dateController: DateController) {
        super(TableName.CURRENT_DATE);
        this.dateController = dateController;
    }

    public async save(currentDate: CurrentDate): Promise<CurrentDate> {
        if (!currentDate) {
            return Promise.resolve(null);
        }

        currentDate.date = await this.dateController.save(currentDate.date);
        return this.getRepo().save(currentDate);
    }
}