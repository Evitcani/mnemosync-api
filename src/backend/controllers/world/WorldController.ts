import {AbstractController} from "../Base/AbstractController";
import {World} from "../../entity/World";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {injectable} from "inversify";
import {getManager} from "typeorm";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";
import {WorldQuery} from "mnemoshared/dist/src/models/queries/WorldQuery";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";
import {WhereQuery} from "../../../shared/documentation/databases/WhereQuery";
import {keys} from "ts-transformer-keys";

@injectable()
export class WorldController extends AbstractController<World> {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(TableName.WORLD);
    }

    /**
     * Creates a new world.
     *
     * @param world The world to create.
     */
    public async save(world: World): Promise<World> {
        return this.getRepo().save(world)
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new world.");
                console.error(err);
                return null;
            });
    }

    public async saveUserToWorld (discordId: string, worldId: string): Promise<boolean> {
        let sanitizedDiscordId = StringUtility.escapeSQLInput(discordId);
        let sanitizedWorldId = StringUtility.escapeSQLInput(worldId);

        return getManager().getRepository(TableName.WORLD_OWNERS)
            .save({
                discord_id: `${sanitizedDiscordId}`,
                world_id: `${sanitizedWorldId}`
            })
            .then((ret) => {
                if (!ret) {
                    return false;
                }
                return true;
            }).catch((err: Error) => {
                console.error("ERR ::: Could not add user to world.");
                console.log(`Sanitized Discord ID: ${discordId}` );
                console.error(err);
                return false;
            });
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param id The name of the world to get.
     */
    public getDiscordId(id: string): Promise<Set<string>> {
        return this.getAllByParamsExtra({id: id}, false).then((worlds) => {
            if (!worlds || worlds.length <= 0) {
                return null;
            }

            let ids = new Set<string>();
            worlds.forEach((world) => {
                if (world.discordId != null && world.discordId != '') {
                    ids.add(world.discordId)
                }
            });

            return ids;
        });
    }

    public async getById(id: string): Promise<World> {
        return this.getRepo().findOne({where: {id: id}}).then((world) => {
            if (!world) {
                return null
            }

            return world;
        }).catch((err) => {
            console.error(err);
            return null;
        });
    }
    public async getAllByParams(params: WorldQuery): Promise<World[]> {
        return this.getAllByParamsExtra(params, true).then((res) => {
            if (!res || res.length <= 0) {
                return null;
            }

            let worlds = new Map<string, World>();
            res.forEach((world: World) => {
                worlds.set(world.id, world);
            });

            return Array.from(worlds.values());
        });
    }

    protected async getAllByParamsExtra(params: WorldQuery, worldFirst: boolean): Promise<any[]> {
        let nameStr = "world";
        let secondStr = "owners";

        let join = `"${nameStr}"."${ColumnName.ID}" = "${secondStr}"."${ColumnName.WORLD_ID}"`;
        let query = getManager()
            .getRepository(worldFirst ? this.tableName : TableName.WORLD_OWNERS)
            .createQueryBuilder(worldFirst ? nameStr : secondStr)
            .leftJoinAndSelect(worldFirst ? TableName.WORLD_OWNERS : this.tableName,
                worldFirst ? secondStr : nameStr, join);

        let flag = false;
        if (params.name != null) {
            let str = WhereQuery.LIKE(nameStr, ColumnName.NAME, params.name);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.discord_id != null) {
            let str = WhereQuery.EQUALS(secondStr, ColumnName.DISCORD_ID, params.discord_id);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.ids != null || params.id != null) {
            let ids = new Set<string>();
            if (params.ids != null) {
                if (Array.isArray(params.ids)) {
                    if (params.ids.length > 0) {
                        ids = new Set<string>(params.ids);
                    }
                } else {
                    ids.add(params.ids);
                }
            }

            if (params.id != null) {
                ids.add(params.id);
            }

            let str = WhereQuery.IN_LIST(nameStr, ColumnName.ID, Array.from(ids.values()));

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (!flag) {
            return Promise.resolve(null);
        }

        if (params.limit != null) {
            query.take(params.limit)
        }

        if (params.skip != null) {
            query.skip(params.skip);
        }

        return query
            .getMany().catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }
}