import {PartyFund} from "../../../backend/entity/PartyFund";
import {PartyFundDTO} from "@evitcani/mnemoshared/dist/src/dto/model/PartyFundDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";
import {AbstractConverter} from "./AbstractConverter";
import {MoneyUtility} from "@evitcani/mnemoshared/dist/src/utilities/MoneyUtility";
import {StringUtility} from "@evitcani/mnemoshared/dist/src/utilities/StringUtility";

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
        vo.id = this.checkNumber(dto.id || null);
        vo.type = StringUtility.escapeSQLInput(dto.type || null);

        // Make uppercase.
        if (vo.type != null) {
            vo.type = vo.type.toUpperCase();
        }

        // Convert to base amount.
        vo.amount = this.checkNumber(MoneyUtility.pileIntoCopper(dto) || null);

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