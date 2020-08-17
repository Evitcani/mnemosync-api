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
            relations: ["worldToCharacter", "nicknames", "worldToCharacter.party", "worldToCharacter.party.funds"]
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
        // Save the character.
        let char = await this.getRepo().save(character).catch((err: Error) => {
            console.error("ERR ::: Could not create the new character.");
            console.log(err.stack);
            return null;
        });

        if (!char) {
            return Promise.resolve(null);
        }

        let mapping = await this.addUserToCharacter(discordId, character.id);
        if (mapping == null) {
            console.error("FAILED TO ADD USER TO CHARACTER.");
        }

        // Add world to character mapping.
        let worldMapping = await this.addWorldToCharacter(char.worldToCharacter);
        if (worldMapping == null) {
            return this.getRepo().delete(char).then(() => {
                return null;
            }).catch((err: Error) => {
                console.error("ERR ::: Could not delete character after failed world mapping.");
                console.log(err.stack);
                return null;
            });
        }

        // Save this ID.
        char.worldToCharacter = worldMapping;
        char = await this.getRepo().save(character).catch((err: Error) => {
            console.error("ERR ::: Could not create the new character.");
            console.log(err.stack);
            return null;
        });

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
        let ids: string[] = await this.getNicknameByNickname(params)
            .then((characters) => {
                // Check the party is valid.
                if (!characters || characters.length < 1) {
                    return null;
                }

                let ids = new Set<string>();
                characters.forEach((character) => {
                    ids.add(character.characterId);
                });

                return Array.from(ids.values());
            });

        // Setup aliases.
        const alias = "character",
            alias2 = "world",
            alias3 = "nickname",
            alias4 = "primary_name";

        // Create basic query and map relations.
        let query = this.getRepo().createQueryBuilder(alias)
            .innerJoinAndMapOne(`${alias}.worldToCharacter`, `${alias}.worldToCharacter`, alias2)
            .innerJoinAndMapMany(`${alias}.nicknames`, `${alias}.nicknames`, alias3);

        // Add naming conventions.
        CharacterController.addPrimaryNameQuery(query, alias4, `"${alias}"."${ColumnName.ID}"`);
        CharacterController.addNicknameQuery(query, alias3);

        // Now get by IDs.
        query.whereInIds(ids);

        // Now do the query.
        return query.getMany()
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

    private async getNicknameByNickname(params: CharacterQuery): Promise<WorldToCharacter[]> {
        let firstName = "world";
        let secondName = "nickname";
        let thirdName = "user";
        let fourthName = "primary_name";
        let query = this
            .getSecondaryRepo()
            .createQueryBuilder(firstName);
        CharacterController.addPrimaryNameQuery(query, fourthName, `"${firstName}"."${ColumnName.CHARACTER_ID}"`);
        query.leftJoin(TableName.USER_TO_CHARACTER, thirdName,
            `"${fourthName}"."${ColumnName.CHARACTER_ID}" = "${thirdName}"."${ColumnName.CHARACTER_ID}"`);

        let flag = false;
        if (params.name != null) {
            // Add the right pieces.
            query.innerJoinAndSelect(TableName.NICKNAME, secondName,
                `"${firstName}"."${ColumnName.CHARACTER_ID}" = "${secondName}"."${ColumnName.CHARACTER_ID}"`);
            CharacterController.addNicknameQuery(query, secondName);

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

        return query
            .getMany()
            .then((characters) => {
                if (characters == null || characters.length <= 0) {
                    return null;
                }

                return characters;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }

    private static addPrimaryNameQuery(query: SelectQueryBuilder<any>, alias: string, joinCondition: string): void {
        query.innerJoinAndSelect(TableName.NICKNAME, alias,
            `${joinCondition} = "${alias}"."${ColumnName.CHARACTER_ID}" AND ` +
            `"${alias}"."${ColumnName.IS_PRIMARY_NAME}" IS TRUE`);

        // Order by name
        query.addOrderBy(`"${alias}"."${ColumnName.NAME}"`, "ASC");
    }

    private static addNicknameQuery(query: SelectQueryBuilder<any>, nicknameAlias: string): void {
        // Order by name.
        query.addOrderBy(`(CASE WHEN "${nicknameAlias}"."${ColumnName.IS_PRIMARY_NAME}" THEN ` +
            `"${nicknameAlias}"."${ColumnName.NAME}" END)`, "ASC");
        query.addOrderBy(`"${nicknameAlias}"."${ColumnName.NAME}"`, "ASC");
    }
}