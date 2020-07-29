import {Character} from "../../../../backend/entity/Character";
import {messageEmbed} from "../../messages/MessageEmbed";
import {MessageEmbedReturn} from "../../../models/MessageEmbedReturn";

export class CharacterRelatedClientResponses {
    static NOW_PLAYING_AS_CHARACTER(character: Character, newlyCreated: boolean): MessageEmbedReturn {
        return messageEmbed.character.now_playing_as(character, newlyCreated);
    }
}