import {TableName} from "../../../shared/documentation/databases/TableName";
import {Party} from "../../entity/Party";
import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {PartyQuery} from "mnemoshared/dist/src/models/queries/PartyQuery";
import {Any, getManager} from "typeorm";
import {WhereQuery} from "../../../shared/documentation/databases/WhereQuery";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";

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
        return this.getByIds([id]).then((parties) => {
            if (parties == null || parties.length <= 0) {
                return null;
            }

            return parties[0];
        });
    }

    public getByIds(ids: number[]): Promise<Party[]> {
        return this.getRepo().find({where: {id: Any(ids)}, relations: ["funds"]}).then((parties) => {
            if (parties == null || parties.length <= 0) {
                return null;
            }
            return parties;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get party.");
            console.error(err);
            return null;
        });
    }

    public async getByParameters(params: PartyQuery): Promise<Party[]> {
        const alias = "party";
        let query = getManager()
            .getRepository(Party)
            .createQueryBuilder(alias);

        let flag = false;
        if (params.guild_id != null) {
            let str = WhereQuery.EQUALS(alias, ColumnName.GUILD_ID, params.guild_id);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.world_id != null) {
            let str = WhereQuery.EQUALS(alias, ColumnName.WORLD_ID, params.world_id);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.name != null) {
            let str = WhereQuery.LIKE(alias, ColumnName.NAME, params.name);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        let idQuery = this.getIdsQuery(params, alias, ColumnName.ID);
        if (idQuery != null) {
            if (flag) {
                query.andWhere(idQuery);
            } else {
                query.where(idQuery);
            }

            flag = true;
        }

        // No arguments to search on.
        if (!flag) {
            return Promise.resolve(null);
        }

        if (params.skip != null) {
            query.skip(params.skip);
        }

        if (params.limit != null) {
            query.limit(params.limit);
        }

        return query
            .getMany()
            .then((parties) => {
                if (parties == null || parties.length <= 0) {
                    return null;
                }

                let set = new Set<number>();
                parties.forEach((pt) => {
                    set.add(pt.id);
                });

                return this.getByIds(Array.from(set.values()));
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get parties.");
                console.error(err);
                return null;
            });
    }
}