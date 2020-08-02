import {Party} from "../../../../../backend/entity/Party";
import {PartyFundConverter} from "./PartyFundConverter";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {PartyDTO} from "@evitcani/mnemoshared/dist/src/dto/model/PartyDTO";

export class PartyConverter {
    public static convertVoToDto(vo: Party): PartyDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.PARTY});
    }

    public static convertExistingVoToDto(vo: Party, dto: PartyDTO): PartyDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.name = vo.name;
        dto.guildId = vo.guildId;
        dto.creatorDiscordId = vo.creatorDiscordId;

        // Convert party funds.
        dto.funds = [];
        if (vo.funds != null && vo.funds.length > 0) {
            vo.funds.forEach((value) => {
                let fund = PartyFundConverter.convertVoToDto(value);
                if (fund != null) {
                    dto.funds.push(fund);
                }
            })
        }

        // Convert current date.
        dto.currentDateId = vo.currentDateId;

        // Convert world.
        dto.worldId = vo.worldId;

        // Return
        return dto;
    }
}