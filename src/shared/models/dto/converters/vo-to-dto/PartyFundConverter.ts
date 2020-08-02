import {PartyFund} from "../../../../../backend/entity/PartyFund";
import {PartyFundDTO} from "@evitcani/mnemoshared/dist/src/dto/model/PartyFundDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class PartyFundConverter {
    public static convertVoToDto(vo: PartyFund): PartyFundDTO {
        return this.convertExistingVoToDto(vo, {dtoType: DTOType.PARTY_FUND});
    }

    public static convertExistingVoToDto(vo: PartyFund, dto: PartyFundDTO): PartyFundDTO {
        if (!vo) {
            return null;
        }

        // Convert simple items.
        dto.id = vo.id;
        dto.createdDate = vo.createdDate;
        dto.updatedDate = vo.updatedDate;
        dto.type = vo.type;
        dto.copper = vo.amount;

        // Return
        return dto;
    }
}