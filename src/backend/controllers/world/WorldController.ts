import {AbstractController} from "../Base/AbstractController";
import {World} from "../../entity/World";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {injectable} from "inversify";
import {User} from "../../entity/User";
import {StringUtility} from "../../utilities/StringUtility";
import {Collection, Message} from "discord.js";
import {WorldRelatedClientResponses} from "../../../shared/documentation/client-responses/information/WorldRelatedClientResponses";
import {getConnection} from "typeorm";
import {BaseQueryRunner} from "typeorm/query-runner/BaseQueryRunner";
import {Nickname} from "../../entity/Nickname";

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
    public async create(world: World): Promise<World> {
        return this.getRepo().save(world)
            .catch((err: Error) => {
                console.error("ERR ::: Could not create new world.");
                console.error(err);
                return null;
            });
    }

    public async worldSelectionFromUser(user: User, message: Message): Promise<World> {
        // If the default world is not null, then add the character on that world.
        let worlds: World[] = [];
        if (user.defaultWorld != null) {
            worlds.push(user.defaultWorld);
        }

        if (user.defaultCharacter != null && user.defaultCharacter.party != null && user.defaultCharacter.party.world != null) {
            worlds.push(user.defaultCharacter.party.world);
        }

        if (worlds.length < 1) {
            await message.channel.send("No world to choose from!");
            return Promise.resolve(null);
        }

        // No selection needed.
        if (worlds.length == 1) {
            return Promise.resolve(worlds[0]);
        }

        return this.worldSelection(worlds, message);
    }

    public async worldSelection(worlds: World[], message: Message): Promise<World> {
        return message.channel.send(WorldRelatedClientResponses.SELECT_WORLD(worlds, "switch")).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed world processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= worlds.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return worlds[choice];
            }).catch(()=> {
                msg.delete({reason: "Removed world processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
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
    public getDiscordId(id: string): Promise<Collection<string, string>> {
        return getConnection()
            .createQueryBuilder(User, "user")
            .leftJoinAndSelect(TableName.WORLD_OWNERS, "owners", `user.id = "owners"."usersId"`)
            .where(`"owners"."worldsId" = '${id}'`)
            .getMany()
            .then((users) => {
                if (!users || users.length < 1) {
                    return null;
                }

                let input = new Collection<string, string>(), user: User, discordId: string, i;
                for (i = 0; i < users.length; i++) {
                    user = users[i];
                    discordId = user.discord_id;
                    input.set(discordId, discordId);
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
}