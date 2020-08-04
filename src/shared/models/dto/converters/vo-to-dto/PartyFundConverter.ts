import {PartyFund} from "../../../../../backend/entity/PartyFund";
import {PartyFundDTO} from "@evitcani/mnemoshared/dist/src/dto/model/PartyFundDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {AbstractConverter} from "./AbstractConverter";
import {MoneyUtility} from "@evitcani/mnemoshared/dist/src/utilities/MoneyUtility";

export class PartyFundConverter extends AbstractConverter<PartyFund, PartyFundDTO> {

    public convertExistingVoToDto(vo: PartyFund, dto: PartyFundDTO): PartyFundDTO {
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

    convertExistingDtoToVo(vo: PartyFund, dto: PartyFundDTO): PartyFund {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        vo.id = dto.id || null;
        vo.type = dto.type || null;

        // Convert to base amount.
        vo.amount = MoneyUtility.pileIntoCopper(dto) || null;

        // Return
        return vo;
    }

    protected getNewDTO(): PartyFundDTO {
        return {dtoType: DTOType.PARTY_FUND};
    }

    protected getNewVO(): PartyFund {
        return new PartyFund();
    }
}