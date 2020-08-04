import {injectable} from "inversify";
import {AbstractController} from "../../Base/AbstractController";
import {GameDate} from "../../../entity/GameDate";
import {TableName} from "../../../../shared/documentation/databases/TableName";

@injectable()
export class DateController extends AbstractController<GameDate> {
    constructor() {
        super(TableName.GAME_DATE);
    }

    public async save(date: GameDate): Promise<GameDate> {
        if (!date) {
            return Promise.resolve(null);
        }
        return this.getRepo().save(date);
    }
}