import {AbstractController} from "../Base/AbstractController";
import {SpecialChannel} from "../../entity/SpecialChannel";
import {TableName} from "../../../shared/documentation/databases/TableName";

export class SpecialChannelController extends AbstractController<SpecialChannel> {
    constructor() {
        super(TableName.SPECIAL_CHANNEL);
    }

    public async save(specialChannel: SpecialChannel): Promise<SpecialChannel> {
        return this.getRepo().save(specialChannel).catch((err) => {
            console.error(err);
            return null;
        })
    }
}