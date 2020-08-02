import {PartyFund} from "../../../../../backend/entity/PartyFund";
import {PartyFundDTO} from "../../model/PartyFundDTO";
import {DTOType} from "../../DTOType";

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
        dto.platinum = vo.platinum;
        dto.gold = vo.gold;
        dto.silver = vo.silver;
        dto.copper = vo.copper;

        // Return
        return dto;
    }
}