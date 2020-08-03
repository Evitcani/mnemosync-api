import {Character} from "../../entity/Character";
import {injectable} from "inversify";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {Nickname} from "../../entity/Nickname";
import {AbstractSecondaryController} from "../Base/AbstractSecondaryController";
import {NameValuePair} from "../Base/NameValuePair";
import {Party} from "../../entity/Party";
import {getConnection, getManager} from "typeorm";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";
import {UserToCharacter} from "../../entity/UserToCharacter";
import {ColumnName} from "../../../shared/documentation/databases/ColumnName";

@injectable()
export class CharacterController extends AbstractSecondaryController<Character, UserToCharacter> {
    constructor() {
        super(TableName.CHARACTER, TableName.USER_TO_CHARACTER);
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

    public async create(character: Character, discordId: string): Promise<Character> {
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


        let nick = await this.createNickname(nickname.name, char);

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

    public async createNickname (nickname: string, character: Character): Promise<Nickname> {
        const nn = new Nickname();
        nn.name = nickname;
        nn.character = character;

        return getManager().getRepository(TableName.NICKNAME).save(nn).catch((err: Error) => {
            console.error("ERR ::: Could not create new nickname.");
            console.error(err);
            return null;
        });
    }

    public async getCharactersByName(name: string, discordId: string): Promise<Character[]> {
        return this.getNicknameByNickname(name, discordId).then((nicknames) => {
            if (nicknames == null || nicknames.length < 1) {
                return null;
            }

            let characters = new Map<string, Character>();
            nicknames.forEach((nickname) => {
                characters.set(nickname.characterId, nickname.character);
            });

            let ret: Character[] = [];
            characters.forEach((character) => {
                ret.push(character);
            });

            return ret;
        })
    }

    /**
     * Gets all the discord IDs related to this character.
     * @param characterId
     */
    public async getDiscordId(characterId: number): Promise<Map<string, string>> {
        return this.getSecondaryRepo().find({where: {characterId: characterId}}).then((nicknames) => {
            if (!nicknames || nicknames.length < 1) {
                return null;
            }

            let input = new Map<string, string>();
            let nickname: UserToCharacter, discordId: string, i;
            for (i = 0; i < nicknames.length; i++) {
                nickname = nicknames[i];
                discordId = nickname.discordId;
                input.set(discordId, discordId);
            }

            return input;
        });
    }

    private async getNicknameByNickname(nickname: string, discordId: string): Promise<Nickname[]> {
        let sanitizedName = StringUtility.escapeSQLInput(nickname);

        return this
            .getSecondaryRepo()
            .createQueryBuilder("user")
            .leftJoinAndSelect(TableName.NICKNAME, "nickname",
                `user.${ColumnName.CHARACTER_ID} = nickname.${ColumnName.CHARACTER_ID}`)
            .where(`user.${ColumnName.DISCORD_ID} = '${discordId}'`)
            .andWhere(`LOWER(nickname.name) LIKE LOWER('%${sanitizedName}%')`)
            .getMany()
            .catch((err: Error) => {
                console.error("ERR ::: Could not get worlds.");
                console.error(err);
                return null;
            });
    }
}