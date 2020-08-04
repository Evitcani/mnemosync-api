import {AbstractController} from "../Base/AbstractController";
import {SpecialChannel} from "../../entity/SpecialChannel";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {SpecialChannelDesignation} from "../../../shared/enums/SpecialChannelDesignation";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";
import {injectable} from "inversify";

@injectable()
export class SpecialChannelController extends AbstractController<SpecialChannel> {
    constructor() {
        super(TableName.SPECIAL_CHANNEL);
    }

    /**
     * Saves the special channel.
     *
     * @param specialChannel
     */
    public async save(specialChannel: SpecialChannel): Promise<SpecialChannel> {
        return this.getRepo().save(specialChannel).catch((err) => {
            console.error(err);
            return null;
        })
    }

    public async get(guildId: string, designation: SpecialChannelDesignation): Promise<SpecialChannel> {
        if (!guildId || designation === null) {
            console.log("Nothing here!");
            return Promise.resolve(null);
        }

        let sanitizedGuildId = StringUtility.escapeSQLInput(guildId);

        this.getRepo().findOne({
            where: {
                guild_id: sanitizedGuildId,
                designation: designation
            }})
            .catch((err) => {
                console.error(err);
                return null;
            })
    }
}