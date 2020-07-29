import {NonPlayableCharacter} from "../../../../backend/entity/NonPlayableCharacter";
import {BasicEmbed} from "../../BasicEmbed";
import {World} from "../../../../backend/entity/World";
import {NPCController} from "../../../../backend/controllers/character/NPCController";
import {messageResponse} from "../../messages/MessageResponse";
import {MessageEmbedReturn} from "../../../models/MessageEmbedReturn";

/**
 * NPC responses to the client.
 */
export class NPCRelatedClientResponses {
    static DISPLAY_ALL(npcs: NonPlayableCharacter[], world: World, page: number): MessageEmbedReturn {
        return BasicEmbed.get()
            .setTitle(messageResponse.npc.display_all.title(world.name))
            .setDescription(messageResponse.npc.display_all.desc(world.name, npcs))
            .setFooter(BasicEmbed.getPageFooter(page, NPCController.NPC_LIMIT, npcs.length));
    }
}