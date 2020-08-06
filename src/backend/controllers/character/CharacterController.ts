import {Character} from "../../entity/Character";
import {injectable} from "inversify";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {Nickname} from "../../entity/Nickname";
import {AbstractSecondaryController} from "../Base/AbstractSecondaryController";
import {Any, getManager} from "typeorm";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";
import {UserToCharacter} from "../../entity/UserToCharacter";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";
import {CharacterQuery} from "@evitcani/mnemoshared/dist/src/models/queries/CharacterQuery";

@injectable()
export class CharacterController extends AbstractSecondaryController<Character, UserToCharacter> {
    constructor() {
        super(TableName.CHARACTER, TableName.USER_TO_CHARACTER);
    }

    public async getWorldIdsByCharacterId(id: string): Promise<string[]> {
        let ids = [];
        let users = await this.getSecondaryRepo().find({where: {characterId: id}});
        if (users && users.length > 0) {
            users.forEach((value) => {
                ids.push(value.worldId);
            });
        }

        let character = await this.getById(id);
        if (character && character.party != null && character.party.worldId != null) {
            ids.push(character.party.worldId);
        }

        if (ids.length <= 0) {
            return Promise.resolve(null);
        }

        console.log("Number of IDs: " + ids.length);

        return Promise.resolve(ids);
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

        return this.getRepo().findOne({where: {id: id}, relations: ["party", "nicknames"]})
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

        return char;
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

    public async createNickname (nickname: Nickname): Promise<Nickname> {
        return getManager().getRepository(TableName.NICKNAME).save(nickname).catch((err: Error) => {
            console.error("ERR ::: Could not create new nickname.");
            console.error(err);
            return null;
        });
    }

    public async getCharactersByParams(params: CharacterQuery): Promise<Character[]> {
        let ids = await this.getNicknameByNickname(params).then((nicknames) => {
            if (nicknames == null || nicknames.length < 1) {
                return null;
            }

            let ids = new Set<string>();
            nicknames.forEach((nickname) => {
                ids.add(nickname.characterId);
            });

            return ids;
        });

        if (!ids) {
            return Promise.resolve(null);
        }

        return this.getRepo().find({where: {id: Any(Array.from(ids.values()))}, relations: ["nicknames"]})
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
     * @param characterId
     */
    public async getDiscordId(characterId: string): Promise<Set<string>> {
        return this.getSecondaryRepo().find({where: {characterId: characterId}}).then((nicknames) => {
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

    private async getNicknameByNickname(params: CharacterQuery): Promise<Nickname[]> {
        let query = this
            .getSecondaryRepo()
            .createQueryBuilder("user")
            .leftJoinAndSelect(TableName.NICKNAME, "nickname",
                `"user"."${ColumnName.CHARACTER_ID}" = "nickname"."${ColumnName.CHARACTER_ID}"`);

        let flag = false;
        if (params.name != null) {
            let sanitizedName = StringUtility.escapeSQLInput(params.name);
            let str = `LOWER("nickname"."${ColumnName.NAME}") LIKE LOWER('%${sanitizedName}%')`;

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.discord_id != null) {
            let sanitizedName = StringUtility.escapeSQLInput(params.discord_id);
            let str = `"user"."${ColumnName.DISCORD_ID}" = '${sanitizedName}'`;

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.world_id != null) {
            let sanitizedName = StringUtility.escapeSQLInput(params.world_id);
            let str = `"user"."${ColumnName.WORLD_ID}" = '${sanitizedName}'`;

            if (flag) {
                query.andWhere(str);
            } else {
                query.where(str);
            }

            flag = true;
        }

        if (params.is_npc != null) {
            let str = `"user"."${ColumnName.DISCORD_ID}" IS `;
            if (!params.is_npc) {
                str += `NOT `;
            }
            str += `NULL`;

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


        return query
            .getMany()
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }
}