import {Party} from "../../../../backend/entity/Party";
import {messageEmbed} from "../../messages/MessageEmbed";
import {messageTypes} from "../../messages/MessageTypes";
import {MessageEmbedReturn} from "../../../models/MessageEmbedReturn";

export class PartyRelatedClientResponses {
    static SELECT_PARTY(parties: Party[], action: string): MessageEmbedReturn {
        return messageEmbed.generic.select_from_the_following(messageTypes.party, action, parties);
    }
}