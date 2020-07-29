import {Party} from "../../../../backend/entity/Party";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {messageResponse} from "../../messages/MessageResponse";
import {MessageEmbedReturn} from "../../../models/MessageEmbedReturn";

export class WhichRelatedClientResponses {
    static LIST_ALL_PARTIES (parties: Party[]): MessageEmbedReturn {
        return messageEmbed.generic.display_all(messageTypes.party, messageTypes.server,
            messageResponse.party.command.create, parties);
    }
}