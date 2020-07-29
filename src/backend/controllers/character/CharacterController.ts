import {Character} from "../../entity/Character";
import {injectable} from "inversify";
import {TableName} from "../../../shared/documentation/databases/TableName";
import {Nickname} from "../../entity/Nickname";
import {AbstractSecondaryController} from "../Base/AbstractSecondaryController";
import {NameValuePair} from "../Base/NameValuePair";
import {Party} from "../../entity/Party";
import {getConnection} from "typeorm";
import {StringUtility} from "../../utilities/StringUtility";

@injectable()
export class CharacterController extends AbstractSecondaryController<Character, Nickname> {
    constructor() {
        super(TableName.CHARACTER, TableName.USER_TO_CHARACTER);
    }

    /**
     * Gets a character by ID.
     *
     * @param id The ID of the character to get.
     */
    public async getById(id: number): Promise<Character> {
        // Not a valid argument.
        if (id == null || id < 1) {
            return null;
        }

        return this.getRepo().findOne({where: {id: id}, relations: ["party", "travel_config"]})
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
        nickname.discord_id = discordId;
        nickname.character = character;
        nickname.name = character.name;

        // Add the nickname to the character.
        character.nicknames = [];
        character.nicknames.push(nickname);

        return this.getRepo().save(character).then((char) => {
            if (!char) {
                return null;
            }
            return this.createNickname(nickname.name, char, discordId).then((nick) => {
                if (nick == null) {
                    return this.getRepo().delete(char).then(() => {
                        return null;
                    }).catch((err: Error) => {
                        console.error("ERR ::: Could not delete character after failed nickname mapping.");
                        console.log(err.stack);
                        return null;
                    });
                }

                return char;
            });
        }).catch((err: Error) => {
            console.error("ERR ::: Could not create the new character.");
            console.log(err.stack);
            return null;
        });
    }

    public async createNickname (nickname: string, character: Character, discordId: string): Promise<Nickname> {
        const nn = new Nickname();
        nn.discord_id = discordId;
        nn.name = nickname;
        nn.character = character;

        return this.getSecondaryRepo().save(nn).catch((err: Error) => {
            console.error("ERR ::: Could not create new nickname.");
            console.error(err);
            return null;
        });
    }

    public async getCharacterByNameInParties (name: string, parties: Party[]): Promise<Character[]> {
        let sanitizedName = StringUtility.escapeSQLInput(name);
        let partyIds: number[] = [], i;
        for (i = 0; i < parties.length; i++) {
            partyIds.push(parties[i].id);
        }

        return getConnection()
            .createQueryBuilder(Character, "character")
            .leftJoinAndSelect(Nickname, "nick", `character.id = "nick"."characterId"`)
            .where(`LOWER("nick"."name") LIKE LOWER('%${sanitizedName}%')`)
            .andWhere(`"character"."partyId" = ANY(ARRAY[${partyIds.join(",")}])`)
            .getMany()
            .then((characters) => {
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

    public async getCharacterByName(name: string, discordId: string): Promise<Character> {
        return this.getNicknameByNickname(name, discordId).then((nickname) => {
            if (nickname == null || nickname.length < 1) {
                return null;
            }

            if (nickname[0].character == null) {
                return this.getById(nickname[0].characterId);
            }

            return nickname[0].character;
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
            let nickname: Nickname, discordId: string, i;
            for (i = 0; i < nicknames.length; i++) {
                nickname = nicknames[i];
                discordId = nickname.discord_id;
                input.set(discordId, discordId);
            }

            return input;
        });
    }

    private async getNicknameByNickname(nickname: string, discordId: string): Promise<Nickname[]> {
        return this.getSecondaryLikeArgs(
            [new NameValuePair("discord_id", discordId)],
            [new NameValuePair("name", nickname)])
            .catch((err: Error) => {
                console.error("ERR ::: Could not get nickname.");
                console.error(err);
                return null;
            });
    }
}