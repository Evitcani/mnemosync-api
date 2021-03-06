import {Party} from "../../../backend/entity/Party";
import {PartyFundConverter} from "./PartyFundConverter";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";
import {PartyDTO} from "mnemoshared/dist/src/dto/model/PartyDTO";
import {AbstractConverter} from "./AbstractConverter";
import {StringUtility} from "mnemoshared/dist/src/utilities/StringUtility";

export class PartyConverter extends AbstractConverter<Party, PartyDTO> {
    private partyFundConverter: PartyFundConverter;

    constructor() {
        super();
        this.partyFundConverter = new PartyFundConverter();
    }

    convertExistingDtoToVo(vo: Party, dto: PartyDTO): Party {
        if (!dto) {
            return null;
        }

        // Convert simple items.
        vo.id = this.checkNumber(dto.id) || undefined;
        vo.name = StringUtility.escapeSQLInput(dto.name || null);
        vo.guildId = StringUtility.escapeSQLInput(dto.guildId || null);
        vo.creatorDiscordId =StringUtility.escapeSQLInput( dto.creatorDiscordId || null);

        // Convert current date.
        vo.currentDateId = StringUtility.escapeSQLInput(dto.currentDateId || null);

        // Convert world.
        vo.worldId = StringUtility.escapeSQLInput(dto.worldId || null);

        // Return
        return vo;
    }

    convertExistingVoToDto(vo: Party, dto: PartyDTO): PartyDTO {
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
                let fund = this.partyFundConverter.convertVoToDto(value);
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

    protected getNewDTO(): PartyDTO {
        return {dtoType: DTOType.PARTY};
    }

    protected getNewVO(): Party {
        return new Party();
    }
}