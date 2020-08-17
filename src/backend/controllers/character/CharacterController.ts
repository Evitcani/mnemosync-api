import {Character} from "../../entity/Character";
import {injectable} from "inversify";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {Nickname} from "../../entity/Nickname";
import {AbstractSecondaryController} from "../Base/AbstractSecondaryController";
import {Any, getManager, SelectQueryBuilder} from "typeorm";
import {WorldToCharacter} from "../../entity/WorldToCharacter";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";
import {CharacterQuery} from "mnemoshared/dist/src/models/queries/CharacterQuery";
import {WhereQuery} from "../../../shared/documentation/databases/WhereQuery";
import {UserToCharacter} from "../../entity/UserToCharacter";
import {Party} from "../../entity/Party";

/**
 * Controller for character management.
 */
@injectable()
export class CharacterController extends AbstractSecondaryController<Character, WorldToCharacter> {


    /**
     * Constructs a new character controller.
     */
    constructor() {
        super(TableName.CHARACTER, TableName.WORLD_TO_CHARACTER);
    }

    /**
     * Gets the list of worlds this character belongs to.
     *
     * @param id The ID of the character to get the worlds for.
     */
    public async getWorldIdsByCharacterId(id: string): Promise<Set<string>> {
        let ids = new Set<string>();
        let users = await this.getSecondaryRepo().find({where: {characterId: id}});
        if (users && users.length > 0) {
            users.forEach((value) => {
                ids.add(value.worldId);
            });
        }

        if (ids.size <= 0) {
            return Promise.resolve(null);
        }

        return Promise.resolve(ids);
    }

    /**
     * Gets a list of parties this character belongs to.
     *
     * @param id The ID of the character to find the list of parties for.
     */
    public async getPartyByCharacterId(id: string): Promise<Party[]> {
        return getManager().getRepository(WorldToCharacter).find({where: {characterId: id}, relations: ["party"]})
            .then((items) => {
                if (items == null || items.length <= 0) {
                    return null;
                }

                let parties = new Map<number, Party>();
                items.forEach((value) => {
                    parties.set(value.partyId, value.party);
                });

                return Array.from(parties.values());
            }).catch((err) => {
                console.log(err);
                return null;
            })
    }

    /**
     * Gets a character by ID.
     *
     * @param id The ID of the character to get.
     */
    public async getById(id: string): Promise<Character> {
        // Not a valid argument.
        if (id == null) {
            return null;
        }

        return this.getRepo().findOne({
            where: {id: id},
            relations: ["worldToCharacter", "nicknames"]
        })
            .then((character) => {
                // Check the party is valid.

                return character;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get character by ID.");
                console.error(err);
                return null;
            });
    }

    public async save(character: Character, discordId: string): Promise<Character> {
        if (!character) {
            return Promise.resolve(null);
        }

        if (!character.id) {
            return this.create(character, discordId);
        }

        return this.getRepo().save(character).catch((err) => {
            console.error(err);
            return null;
        })
    }

    protected async create(character: Character, discordId: string): Promise<Character> {
        // Create nickname for the mapping.
        const nickname = new Nickname();
        nickname.character = character;
        nickname.name = character.name;
        nickname.isPrimaryName = true;

        // Add the nickname to the character.
        character.nicknames = [];
        character.nicknames.push(nickname);

        // Save the character.

        let char = await this.getRepo().save(character).catch((err: Error) => {
            console.error("ERR ::: Could not create the new character.");
            console.log(err.stack);
            return null;
        });

        if (!char) {
            return Promise.resolve(null);
        }

        nickname.character = char;
        let nick = await this.createNickname(nickname);

        if (nick == null) {
            return this.getRepo().delete(char).then(() => {
                return null;
            }).catch((err: Error) => {
                console.error("ERR ::: Could not delete character after failed nickname mapping.");
                console.log(err.stack);
                return null;
            });
        }

        let mapping = await this.addUserToCharacter(discordId, character.id);
        if (mapping == null) {
            console.error("FAILED TO ADD USER TO CHARACTER.");
        }

        // Add world to character mapping.
        let worldMapping = await this.addWorldToCharacter(char.worldToCharacter);
        if (worldMapping == null) {
            console.error("FAILED TO MAP WORLD TO CHARACTER.");
        }

        return char;
    }

    private async addWorldToCharacter(mapping: WorldToCharacter): Promise<WorldToCharacter> {
        return getManager().getRepository(WorldToCharacter).save(mapping).catch((err) => {
            console.log(err);
            return null;
        });
    }

    public async addUserToCharacter(discordId: string, characterId: string): Promise<UserToCharacter> {
        let mapping = new UserToCharacter();
        mapping.discordId = characterId;
        mapping.characterId = characterId;
        return this.getSecondaryRepo().save(mapping).catch((err: Error) => {
            console.error("ERR ::: Could not add user to character.");
            console.log(err.stack);
            return null;
        });
    }

    public async createNickname(nickname: Nickname): Promise<Nickname> {
        return getManager().getRepository(TableName.NICKNAME).save(nickname).catch((err: Error) => {
            console.error("ERR ::: Could not create new nickname.");
            console.error(err);
            return null;
        });
    }

    public async getCharactersByParams(params: CharacterQuery): Promise<Character[]> {
        return this.getNicknameByNickname(params)
            .then((characters) => {
                // Check the party is valid.
                if (!characters || characters.length < 1) {
                    return null;
                }

                return characters;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get characters.");
                console.error(err);
                return null;
            });
    }

    /**
     * Gets all the discord IDs related to this character.
     * @param characterIds
     */
    public async getDiscordId(characterIds: string[]): Promise<Set<string>> {
        return getManager().getRepository(UserToCharacter).find({where: {characterId: Any(characterIds)}}).then((nicknames) => {
            if (!nicknames || nicknames.length < 1) {
                return null;
            }

            let input = new Set<string>();
            let nickname: UserToCharacter, discordId: string, i;
            for (i = 0; i < nicknames.length; i++) {
                nickname = nicknames[i];
                discordId = nickname.discordId;
                input.add(discordId);
            }

            return input;
        });
    }

    private async getNicknameByNickname(params: CharacterQuery): Promise<Character[]> {
        let alias = "character";
        let firstName = "world";
        let secondName = "nickname";
        let thirdName = "user";
        let query = this
            .getRepo()
            .createQueryBuilder(alias)
            .leftJoin(`${alias}."worldToCharacter"`, firstName)
            .leftJoin(`${alias}.nicknames`, secondName)
            .leftJoin(TableName.USER_TO_CHARACTER, thirdName,
                `"${secondName}"."${ColumnName.CHARACTER_ID}" = "${thirdName}"."${ColumnName.CHARACTER_ID}"`)
            .addGroupBy(`"${secondName}"."${ColumnName.CHARACTER_ID}"`)
            .addGroupBy(`"${firstName}"."${ColumnName.ID}"`)
            .addGroupBy(`"${secondName}"."${ColumnName.ID}"`)
            .addGroupBy(`"${thirdName}"."${ColumnName.DISCORD_ID}"`)
            .addGroupBy(`"${thirdName}"."${ColumnName.CHARACTER_ID}"`);

        let flag = false;
        if (params.name != null) {
            let str = WhereQuery.LIKE(secondName, ColumnName.NAME, params.name);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.discord_id != null) {
            let str = WhereQuery.EQUALS(thirdName, ColumnName.DISCORD_ID, params.discord_id);

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.world_id != null) {
            let str = `${WhereQuery.EQUALS(firstName, ColumnName.WORLD_ID, params.world_id)}`;

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.is_npc != null) {
            let str = WhereQuery.IS_TRUE_FALSE(firstName, ColumnName.IS_NPC, true);

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

        // Skip the right amount.
        let skip: number = 0;
        if (params.skip != null) {
            let tempSkip = Number(params.skip);
            if (!isNaN(tempSkip)) {
                skip = tempSkip;
            }

            query.offset(skip);
        }

        // Limit appropriately.
        if (params.limit != null) {
            query.limit(params.limit);
        }

        // Order by name.
        CharacterController.addOrderByQuery(query, secondName);

        console.log(query.getQuery());

        return query
            .getMany()
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }

    private static addOrderByQuery(query: SelectQueryBuilder<any>, nicknameAlias: string): void {
        query.addGroupBy(`"${nicknameAlias}"."${ColumnName.IS_PRIMARY_NAME}"`);
        query.addGroupBy(`"${nicknameAlias}"."${ColumnName.NAME}"`);
        query.addOrderBy(`"${nicknameAlias}"."${ColumnName.IS_PRIMARY_NAME}"`, "DESC");
        query.addOrderBy(`case when "${nicknameAlias}"."${ColumnName.IS_PRIMARY_NAME}" then ` +
            `"${nicknameAlias}"."${ColumnName.NAME}" end`, "ASC");
    }
}