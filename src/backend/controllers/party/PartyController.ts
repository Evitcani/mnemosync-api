import {TableName} from "../../../shared/documentation/databases/TableName";
import {Party} from "../../entity/Party";
import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {NameValuePair} from "../Base/NameValuePair";
import {World} from "../../entity/World";

@injectable()
export class PartyController extends AbstractController<Party> {
    constructor() {
        super(TableName.PARTY);
    }

    /**
     * Creates a new party in the server with the given name.
     *
     * @param partyName The name of the party.
     * @param guildId The ID of the guild for this party to live in.
     * @param discordId The discord id of the creator.
     */
    public create(partyName: string, guildId: string, discordId: string): Promise<Party> {
        const party = new Party();
        party.name = partyName;
        party.guildId = guildId;
        party.creatorDiscordId = discordId;

        return this.getRepo().save(party).then((party) => {
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not create new party.");
            console.error(err);
            return null;
        });
    }

    public save (party: Party): Promise<Party> {
        return this.getRepo().save(party).then((party) => {
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not save party.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets the party by the ID.
     *
     * @param id The ID of the party.
     */
    public getById (id: number): Promise<Party> {
        return this.getRepo().findOne({where: {id: id}}).then((party) => {
            if (party == undefined) {
                return null;
            }
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get party.");
            console.error(err);
            return null;
        });
    }

    public getByGuild (guildId: string): Promise<Party[]> {
        return this.getRepo().find({where: {guildId: guildId}}).then((parties) => {
            if (parties == undefined) {
                return null;
            }
            return parties;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get parties in guild.");
            console.error(err);
            return null;
        });
    }

    public getByWorld (worldId: string): Promise<Party[]> {
        return this.getRepo().find({where: {worldId: worldId}}).then((parties) => {
            if (parties == undefined || parties.length < 1) {
                return null;
            }
            return parties;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get parties in world.");
            console.error(err);
            return null;
        });
    }

    public updatePartyWorld (party: Party, world: World): Promise<Party> {
        party.world = world;
        return this.getRepo().save(party);
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param partyName The name of the party to get.
     * @param guildId The ID of the guild the party lives in.
     */
    public getByNameAndGuild(partyName: string, guildId: string): Promise<Party[]> {
        return this.getLikeArgs(
            [new NameValuePair("guild_id", guildId)],
            [new NameValuePair("name", partyName)])
            .catch((err: Error) => {
                console.error("ERR ::: Could not get parties.");
                console.error(err);
                return null;
            });
    }
}