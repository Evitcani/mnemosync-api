import {AbstractController} from "../Base/AbstractController";
import {User} from "../../entity/User";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {injectable} from "inversify";
import {Character} from "../../entity/Character";
import {World} from "../../entity/World";
import {getConnection} from "typeorm";

@injectable()
export class UserController extends AbstractController<User> {
    /**
     * Construct this controller.
     */
    constructor() {
        super(TableName.USER);
    }

    /**
     * Creates a new user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    private async create(discordId: string, discordName: string): Promise<User> {
        const tempUser = new User();
        tempUser.discord_id = discordId;
        tempUser.discord_name = discordName;

        return this.getRepo().save(tempUser).catch((err: Error) => {
            console.error("ERR ::: Could not create new user.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets the user.
     *
     * @param discordId The discord ID of the user.
     * @param discordName The discord name of user.
     */
    public async get(discordId: string, discordName: string): Promise<User> {
        return this.getRepo().findOne({
                where: {
                    discord_id: discordId
                },
                relations: ["defaultCharacter", "defaultWorld", "defaultParty"]
            })
            .then((user) => {
                if (!user) {
                    return this.create(discordId, discordName);
                }

                // Update the name, if needed.
                if (user.discord_name != discordName) {
                    user.discord_name = discordName;
                    return this.save(user);
                }

                return user;
            }).catch((err: Error) => {
                console.error("ERR ::: Could not get the user.");
                console.error(err);
                return null;
            });
    }

    /**
     * Updates the default character.
     *
     * @param user The user to update.
     * @param character The new character to make default.
     */
    public async updateDefaultCharacter(user: User, character: Character): Promise<User> {
        user.defaultCharacter = character;
        user.defaultCharacterId = character.id;
        return this.save(user);
    }

    /**
     * Updates the default characters.
     *
     * @param user The user to update.
     * @param world The new character to make default.
     */
    public async updateDefaultWorld(user: User, world: World): Promise<User> {
        if (world != null) {
            user.defaultWorld = world;
        } else {
            user.defaultWorld = null;
        }

        return this.save(user);
    }

    public async addWorld(user: User, world: World): Promise<User> {
        return getConnection()
            .createQueryBuilder()
            .relation(User, "campaignsDMing")
            .of(user)
            .add(world).then(() => {
                return user;
            }).catch((err: Error) => {
                console.error("ERR ::: Could not add new world.");
                console.error(err);
                return null;
            });
    }

    /**
     * Saves the user.
     *
     * @param user The user to save.
     */
    public async save(user: User): Promise<User> {
        return this.getRepo().save(user).catch((err: Error) => {
            console.error("ERR ::: Could not save the user.");
            console.error(err);
            return null;
        });
    }
}