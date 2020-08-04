import {AbstractController} from "../Base/AbstractController";
import {World} from "../../entity/World";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {injectable} from "inversify";
import {User} from "../../entity/User";
import {getConnection} from "typeorm";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";
import {WorldQuery} from "@evitcani/mnemoshared/dist/src/models/queries/WorldQuery";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";

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

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param name The name of the world to get.
     * @param user
     */
    public getByNameAndUser(name: string, user: User): Promise<World[]> {
        let sanitizedName = StringUtility.escapeSQLInput(name);

        return this
            .getRepo()
            .createQueryBuilder("world")
            .leftJoinAndSelect(TableName.WORLD_OWNERS, "owners", `world.id = "owners"."worldsId"`)
            .where(`"owners"."usersId" = ${user.id}`)
            .andWhere(`LOWER(world.name) LIKE LOWER('%${sanitizedName}%')`)
            .getMany()
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param id The name of the world to get.
     * @param user
     */
    public getDiscordId(id: string): Promise<Set<string>> {
        return getConnection()
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect(TableName.WORLD_OWNERS, "owners", `user.id = "owners"."usersId"`)
            .where(`"owners"."worldsId" = '${id}'`)
            .getMany()
            .then((users) => {
                if (!users || users.length < 1) {
                    return null;
                }

                let input = new Set<string>(), user: User, discordId: string, i;
                for (i = 0; i < users.length; i++) {
                    user = users[i];
                    discordId = user.discord_id;
                    input.add(discordId);
                }

                return input;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }

    public static isWorld(obj: any): obj is World {
        return ((obj as World).type != undefined && (obj as World).type == "World") || typeof (obj as World).id == "string";
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
        let nameStr = "world";
        let query = this
            .getRepo()
            .createQueryBuilder(nameStr);

        let flag = false;
        if (params.name != null) {
            let sanitizedName = StringUtility.escapeSQLInput(params.name);
            let str = `LOWER("${nameStr}"."${ColumnName.NAME}") LIKE LOWER('%${sanitizedName}%')`;

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.discord_id != null) {
            let sanitizedName = StringUtility.escapeSQLInput(params.discord_id);
            let str = `"${nameStr}"."${ColumnName.DISCORD_ID}" = '${sanitizedName}'`;

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.ids != null) {
            let str;
            if (Array.isArray(params.ids)) {
                str = `"${nameStr}"."${ColumnName.ID}" IN ('${params.ids.join("','")}')`;
            } else {
                str = `"${nameStr}"."${ColumnName.ID}" = '${params.ids}')`;
            }


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
            .getMany()
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }
}