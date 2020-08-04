import {AbstractConverter} from "./AbstractConverter";
import {SpecialChannel} from "../../../../../backend/entity/SpecialChannel";
import {SpecialChannelDTO} from "@evitcani/mnemoshared/dist/src/dto/model/SpecialChannelDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

export class SpecialChannelConverter extends AbstractConverter <SpecialChannel, SpecialChannelDTO> {
    convertExistingDtoToVo(vo: SpecialChannel, dto: SpecialChannelDTO): SpecialChannel {
        if (!dto) {
            return null;
        }

        vo.id = dto.id || null;
        vo.designation = dto.designation || null;
        vo.channel_id = dto.channel_id || null;
        vo.guild_id = dto.guild_id || null;

        return vo;
    }

    convertExistingVoToDto(vo: SpecialChannel, dto: SpecialChannelDTO): SpecialChannelDTO {
        if (!vo) {
            return null;
        }

        dto.id = vo.id || null;
        dto.createdDate = vo.createdDate || null;
        dto.updatedDate = vo.updatedDate || null;
        dto.designation = vo.designation || null;
        dto.channel_id = vo.channel_id || null;
        dto.guild_id = vo.guild_id || null;

        return dto;
    }

    protected getNewDTO(): SpecialChannelDTO {
        return {dtoType: DTOType.SPECIAL_CHANNEL};
    }

    protected getNewVO(): SpecialChannel {
        return new SpecialChannel();
    }

}