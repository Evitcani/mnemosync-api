import {World} from "../../../../backend/entity/World";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {MessageEmbedReturn} from "../../../models/MessageEmbedReturn";

export class WorldRelatedClientResponses {
    static SELECT_WORLD(worlds: World[], action: string): MessageEmbedReturn {
        return messageEmbed.generic.select_from_the_following(messageTypes.world, action, worlds)
    }
}